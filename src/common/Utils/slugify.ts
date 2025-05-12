export function slugify(text: string): string {
    return text
      .toLowerCase()                             // Chuyển thành chữ thường
      .normalize('NFD')                          // Tách các dấu ra
      .replace(/[\u0300-\u036f]/g, '')            // Xóa các dấu tiếng Việt
      .replace(/[^a-z0-9\s-]/g, '')               // Xóa ký tự đặc biệt, chỉ giữ chữ cái, số, khoảng trắng, gạch ngang
      .trim()                                     // Xóa khoảng trắng 2 đầu
      .replace(/\s+/g, '-')                       // Thay tất cả khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, '-');                       // Gộp nhiều dấu gạch ngang liên tiếp thành 1 dấu
  }