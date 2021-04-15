
/*
  @author AJu (zoz0312)
  로또 생성기
*/
export class LottoDraw {
  constructor (
  ) {
  }

  randomLottoDraw () {
    const numbers = Array.from({length: 45}, (undefined, i) => (i+1));
    const picked = [];
    for (let i=1; i<=6; i++) {
      const random = Math.floor(Math.random() * (numbers.length));
      picked.push(...numbers.splice(random, 1))
    }
    picked.sort((a, b) => a - b);

    let message = '행운의 번호입니다!\n\n';
    message += `[${picked.join('] [')}]`;
    return {
      success: true,
      message
    }
  }

  randomPensionLotto () {
    const group  = Array.from({length: 5}, (_, i) => (i + 1));
    const numbers = Array.from({length: 10}, (_, i) => (i));
    const picked = [];

    const gruopNumber = group[Math.floor(Math.random() * (group.length))];

    for (let i=1; i<=6; i++) {
      const random = Math.floor(Math.random() * (numbers.length));
      picked.push(random);
    }
    let message = '행운의 번호입니다!\n\n';
    message += `[${gruopNumber}조] [${picked.join('] [')}]`;
    return {
      success: true,
      message
    }
  }
}