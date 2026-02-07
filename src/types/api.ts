/**
 * 백엔드 ApiResponse 래퍼 타입 (commerce-api)
 */
export interface ApiResponse<T> {
  meta: {
    result: "SUCCESS" | "FAIL";
    errorCode?: string;
    message?: string;
  };
  data: T | null;
}
