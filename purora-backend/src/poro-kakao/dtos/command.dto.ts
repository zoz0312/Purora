/*
  @author AJu (zoz0312)
*/
interface adminCommandDTO {
  service: string;
  name: string; // 키워드 이름
  command: string[]; // 수행할 키워드
  desc: string; // 설명
  argumentDesc?: string[];  // argument 설명
}