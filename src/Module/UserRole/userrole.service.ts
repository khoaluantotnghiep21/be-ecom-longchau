import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserRole } from "./userrole.entity";
import { Repository, Sequelize } from "sequelize-typescript";
import { Role } from "../Role/role.entity";
import { UserRoleDto } from "./dto/userrole.dto";
import { UUID } from "crypto";
import { QueryTypes } from "sequelize";
import { UserWithRolesDto } from "./dto/user-with-roles.dto";
import { IdentityUser } from "../IdentityUser/identityuser.entity";

@Injectable()
export class UserRoleService {
    constructor(
        @InjectModel(UserRole)
        private readonly identityUserRepo: Repository<UserRole>,
        @InjectModel(Role)
        private readonly roleRepo: Repository<Role>,
        @InjectModel(IdentityUser)
        private readonly userRepo: Repository<IdentityUser>,
        private readonly sequelize: Sequelize
    ) {}
    async createUserRole(userroleDto: UserRoleDto): Promise<UserRole> {
        const role = await this.roleRepo.findOne({ where: { id: userroleDto.roleid} });
        if (!role) {
            throw new Error('Role not found');
        }
        const data = {...userroleDto };
        return await this.identityUserRepo.create(data);
    }

    
    async getAllRolesByUserId(userid: string): Promise<{ role: Role; hoten: string }[]> {
        const roles = await this.sequelize.query(
            `
            SELECT r.*, s.hoten
            FROM userrole ur
            JOIN role r ON ur.roleid = r.id
            JOIN identityuser s ON ur.userid = s.id
            WHERE ur.userid = :userid
            `,
            {
                replacements: { userid },
                type: QueryTypes.SELECT,
            }
        );
    
        return roles as { role: Role; hoten: string }[];
    }
      
    /**
     * Gán nhiều vai trò cho một người dùng
     * @param userWithRolesDto Thông tin người dùng và danh sách vai trò
     * @returns Danh sách các bản ghi UserRole đã tạo
     */
    async assignMultipleRolesToUser(userWithRolesDto: UserWithRolesDto): Promise<{
        success: boolean;
        message: string;
        roles: Role[];
        user: { id: string; hoten: string };
    }> {
        const { userid, roleids } = userWithRolesDto;

        // Kiểm tra người dùng tồn tại
        const user = await this.userRepo.findOne({ where: { id: userid } });
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID ${userid}`);
        }

        // Kiểm tra các vai trò tồn tại
        const roles = await this.roleRepo.findAll({
            where: { id: roleids }
        });

        if (roles.length !== roleids.length) {
            throw new NotFoundException('Một hoặc nhiều vai trò không tồn tại');
        }

        try {
            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            const result = await this.sequelize.transaction(async (t) => {
                // Tạo mảng các đối tượng UserRole để thêm vào cơ sở dữ liệu
                const userRoles = roleids.map(roleid => ({
                    userid,
                    roleid
                }));

                // Xóa các bản ghi UserRole hiện tại của người dùng (nếu có)
                await this.identityUserRepo.destroy({
                    where: { userid },
                    transaction: t
                });

                // Thêm các bản ghi UserRole mới
                await this.identityUserRepo.bulkCreate(userRoles, { transaction: t });

                return {
                    success: true,
                    message: `Đã gán ${roles.length} vai trò cho người dùng ${user.hoten}`,
                    roles,
                    user: { id: user.id, hoten: user.hoten }
                };
            });

            return result;
        } catch (error) {
            throw new Error(`Không thể gán vai trò cho người dùng: ${error.message}`);
        }
    }

    /**
     * Cập nhật vai trò của một người dùng
     * @param userWithRolesDto Thông tin người dùng và danh sách vai trò mới
     * @returns Kết quả cập nhật
     */
    async updateUserRoles(userWithRolesDto: UserWithRolesDto): Promise<{
        success: boolean;
        message: string;
        newRoles: Role[];
        user: { id: string; hoten: string };
    }> {
        const { userid, roleids } = userWithRolesDto;

        // Kiểm tra người dùng tồn tại
        const user = await this.userRepo.findOne({ where: { id: userid } });
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID ${userid}`);
        }

        // Kiểm tra các vai trò tồn tại
        const roles = await this.roleRepo.findAll({
            where: { id: roleids }
        });

        if (roles.length !== roleids.length) {
            throw new NotFoundException('Một hoặc nhiều vai trò không tồn tại');
        }

        try {
            // Lấy vai trò hiện tại của người dùng
            const currentRoles = await this.getAllRolesByUserId(userid);
            
            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            const result = await this.sequelize.transaction(async (t) => {
                // Xóa các bản ghi UserRole hiện tại của người dùng
                await this.identityUserRepo.destroy({
                    where: { userid },
                    transaction: t
                });

                // Tạo mảng các đối tượng UserRole để thêm vào cơ sở dữ liệu
                const userRoles = roleids.map(roleid => ({
                    userid,
                    roleid
                }));

                // Thêm các bản ghi UserRole mới
                await this.identityUserRepo.bulkCreate(userRoles, { transaction: t });

                return {
                    success: true,
                    message: `Đã cập nhật vai trò cho người dùng ${user.hoten}`,
                    newRoles: roles,
                    user: { id: user.id, hoten: user.hoten }
                };
            });

            return result;
        } catch (error) {
            throw new Error(`Không thể cập nhật vai trò cho người dùng: ${error.message}`);
        }
    }

    /**
     * Thêm một vai trò mới cho người dùng
     * @param userroleDto Thông tin người dùng và vai trò cần thêm
     * @returns Kết quả thêm vai trò
     */
    async addRoleToUser(userroleDto: UserRoleDto): Promise<{
        success: boolean;
        message: string;
    }> {
        const { userid, roleid } = userroleDto;

        // Kiểm tra người dùng tồn tại
        const user = await this.userRepo.findOne({ where: { id: userid } });
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID ${userid}`);
        }

        // Kiểm tra vai trò tồn tại
        const role = await this.roleRepo.findOne({ where: { id: roleid } });
        if (!role) {
            throw new NotFoundException(`Không tìm thấy vai trò với ID ${roleid}`);
        }

        // Kiểm tra xem người dùng đã có vai trò này chưa
        const existingUserRole = await this.identityUserRepo.findOne({
            where: { userid, roleid }
        });

        if (existingUserRole) {
            return {
                success: false,
                message: `Người dùng ${user.hoten} đã có vai trò ${role.namerole}`
            };
        }

        // Thêm vai trò mới
        await this.identityUserRepo.create({ userid, roleid });

        return {
            success: true,
            message: `Đã thêm vai trò ${role.namerole} cho người dùng ${user.hoten}`
        };
    }

    /**
     * Xóa một vai trò khỏi người dùng
     * @param userid ID người dùng
     * @param roleid ID vai trò cần xóa
     * @returns Kết quả xóa vai trò
     */
    async removeRoleFromUser(userid: string, roleid: string): Promise<{
        success: boolean;
        message: string;
    }> {
        // Kiểm tra người dùng tồn tại
        const user = await this.userRepo.findOne({ where: { id: userid } });
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID ${userid}`);
        }

        // Kiểm tra vai trò tồn tại
        const role = await this.roleRepo.findOne({ where: { id: roleid } });
        if (!role) {
            throw new NotFoundException(`Không tìm thấy vai trò với ID ${roleid}`);
        }

        // Xóa vai trò
        const deleted = await this.identityUserRepo.destroy({
            where: { userid, roleid }
        });

        if (deleted === 0) {
            return {
                success: false,
                message: `Người dùng ${user.hoten} không có vai trò ${role.namerole}`
            };
        }

        return {
            success: true,
            message: `Đã xóa vai trò ${role.namerole} khỏi người dùng ${user.hoten}`
        };
    }
}