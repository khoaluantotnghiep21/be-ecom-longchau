export function slugify(text: string): string {
 
  const vietnameseMap: Record<string, string> = {
    'đ': 'd', 'Đ': 'd'
  };
  
  let result = text;
  for (const [vietnameseChar, latinChar] of Object.entries(vietnameseMap)) {
    result = result.replace(new RegExp(vietnameseChar, 'g'), latinChar);
  }
  
  return result
    .toLowerCase()                             
    .normalize('NFD')                         
    .replace(/[\u0300-\u036f]/g, '')           
    .replace(/[^a-z0-9\s-]/g, '')             
    .trim()                                   
    .replace(/\s+/g, '-')                     
    .replace(/-+/g, '-');                     
}