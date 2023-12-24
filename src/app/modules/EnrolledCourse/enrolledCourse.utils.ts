export const calculateGradeAndPoints = (marks: number) => {
  const gradeAndPoints = {
    grade: 'NA',
    gradePoints: 0,
  };

  /**
   * 80 <= marks <= 100 => A
   * 70 <= marks < 80 => B
   * 60 <= marks < 70 => C
   * 50 <= marks < 60 => D
   * 40 <= marks < 50 => F
   */

  if (marks >= 80) {
    gradeAndPoints.grade = 'A';
    gradeAndPoints.gradePoints = 4;
  } else if (marks >= 60) {
    gradeAndPoints.grade = 'B';
    gradeAndPoints.gradePoints = 3.5;
  } else if (marks >= 40) {
    gradeAndPoints.grade = 'C';
    gradeAndPoints.gradePoints = 3;
  } else if (marks >= 20) {
    gradeAndPoints.grade = 'D';
    gradeAndPoints.gradePoints = 2;
  } else if (marks <= 19) {
    gradeAndPoints.grade = 'F';
    gradeAndPoints.gradePoints = 0;
  } else {
    gradeAndPoints.grade = 'NA';
    gradeAndPoints.gradePoints = 0;
  }

  return gradeAndPoints;
};
