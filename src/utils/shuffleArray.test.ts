import { shuffleArray } from './shuffleArray';

describe('shuffleArray', () => {
  it('should shuffle the array', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffledArray = shuffleArray(array);
    shuffledArray.forEach((value) => {
      expect(array).toContain(value);
    });
  });
});
