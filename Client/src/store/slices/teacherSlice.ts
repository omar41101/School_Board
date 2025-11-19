import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { teacherApi, courseApi, assignmentApi, studentApi, gradeApi, normalizeArrayResponse } from '../../lib/api';

// Minimal domain types used in this slice
type IdRef = string | { _id?: string };

interface Teacher { 
  _id: string; 
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  [key: string]: any;
}
interface Course { 
  _id: string; 
  teacher?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    user?: {
      firstName?: string;
      lastName?: string;
    };
  } | string; 
  enrolledStudents?: string[];
  name?: string;
  subject?: string;
  schedule?: any[];
  [key: string]: any;
}
interface Assignment { 
  _id: string; 
  course?: IdRef | { _id?: string; name?: string };
  title?: string;
  dueDate?: string;
  [key: string]: any;
}
interface Student { 
  _id: string; 
  user?: {
    firstName?: string;
    lastName?: string;
  };
  currentClass?: string;
  [key: string]: any;
}
interface Grade { 
  _id: string; 
  student?: IdRef; 
  course?: IdRef; 
  assignment?: IdRef; 
  percentage?: number; 
  grade?: number; 
  [key: string]: any;
}

interface TeacherDataPayload {
  teacherData: Teacher;
  courses: Course[];
  assignments: Assignment[];
  students: Student[];
  grades: Grade[];
}

interface TeacherState {
  teacherData: Teacher | null;
  courses: Course[];
  assignments: Assignment[];
  students: Student[];
  grades: Grade[];
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teacherData: null,
  courses: [],
  assignments: [],
  students: [],
  grades: [],
  loading: false,
  error: null,
};

const getId = (value: any): string | undefined => {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value._id;
};

export const fetchTeacherData = createAsyncThunk<
  TeacherDataPayload,
  string,
  { rejectValue: string }
>(
  'teacher/fetchData',
  async (userId, { rejectWithValue }) => {
    try {
      const [teachersResponse, coursesResponse, assignmentsResponse, studentsResponse, gradesResponse] = await Promise.all([
        teacherApi.getAll(),
        courseApi.getAll(),
        assignmentApi.getAll(),
        studentApi.getAll(),
        gradeApi.getAll(),
      ]);

      const teachers = normalizeArrayResponse(teachersResponse) as Teacher[];
      const allCourses = normalizeArrayResponse(coursesResponse) as Course[];
      const allAssignments = normalizeArrayResponse(assignmentsResponse) as Assignment[];
      const allStudents = normalizeArrayResponse(studentsResponse) as Student[];
      const allGrades = normalizeArrayResponse(gradesResponse) as Grade[];

      const myTeacher = teachers.find((t) => getId(t.user) === userId);
      if (!myTeacher) throw new Error('Teacher profile not found');

      const myCourses = allCourses.filter((c) => getId(c.teacher) === myTeacher._id);

      const myAssignments = allAssignments.filter((a) =>
        myCourses.some((c) => c._id === getId(a.course))
      );

      const enrolledStudentIds = new Set(
        myCourses.flatMap((c) => c.enrolledStudents || [])
      );
      const myStudents = allStudents.filter((s) => enrolledStudentIds.has(s._id));

      const myGrades = allGrades.filter((g) =>
        myStudents.some((s) => s._id === getId(g.student))
      );

      return {
        teacherData: myTeacher,
        courses: myCourses,
        assignments: myAssignments,
        students: myStudents,
        grades: myGrades,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teacher data');
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearTeacherData: (state) => {
      state.teacherData = null;
      state.courses = [];
      state.assignments = [];
      state.students = [];
      state.grades = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherData.fulfilled, (state, action: PayloadAction<TeacherDataPayload>) => {
        state.loading = false;
        state.teacherData = action.payload.teacherData;
        state.courses = action.payload.courses;
        state.assignments = action.payload.assignments;
        state.students = action.payload.students;
        state.grades = action.payload.grades;
      })
      .addCase(fetchTeacherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTeacherData } = teacherSlice.actions;
export default teacherSlice.reducer;
