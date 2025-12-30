
export interface CreateUpdateStudentDto {
  phoneNumber?: string;
  fullName?: string;
  userName?: string;
  password?: string;
  gender: boolean;
  collegeId?: string;
  universityId?: string;
  gradeLevelId?: string;
  accountTypeKey: number;
  studentMobileIP?: string;
}

export interface StudentDto {
  id?: string;
  phoneNumber?: string;
  fullName?: string;
  userName?: string;
  password?: string;
  gender: boolean;
  collegeId?: string;
  collegeName?: string;
  universityId?: string;
  universityName?: string;
  gradeLevelId?: string;
  gradeLevelName?: string;
  accountTypeKey: number;
  studentMobileIP?: string;
  logoUrl?: string;
  coursesName: string[];
}
