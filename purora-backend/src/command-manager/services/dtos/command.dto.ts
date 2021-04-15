/*
  @author AJu (zoz0312)
*/
interface commandDTO {
  service: string;
  name: string;             // 변수 이름
  command: string[];        // 수행할 command
  desc: string;             // 설명
  argumentDesc?: string[];  // argument 설명
  hiddenFlag?: boolean;     // 도움말 출력 여부
}