
export interface CreateUpdateTeacherDto {
  fullName?: string;
  phoneNumber?: string;
  userName?: string;
  password?: string;
  gender: boolean;
  collegeId?: string;
  universityId?: string;
  accountTypeKey: number;
}

export interface TeacherDto {
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
  accountTypeKey: number;
  logoUrl?: string;
}
