import { apiClient } from "@/lib/apiClient";
import { OFFERING_ENROLLMENTS_BY_OFFERING, OFFERING_ENROLLMENT_DETAILS, OFFERING_ENROLLMENT_STATUS } from "@/lib/apiClient/endpoints";
import type {
  RawOfferingEnrollment,
  OfferingEnrollment,
  RawOfferingEnrollmentDetail,
  OfferingEnrollmentDetail,
  UpdateEnrollmentStatusPayload,
} from "@/features/course-applications/types";
import { normalizeCourseApplicationStatus } from "@/features/course-applications/types";

export const getOfferingEnrollments = async (
  offeringId: string,
): Promise<OfferingEnrollment[]> => {
  const response = await apiClient.get<RawOfferingEnrollment[]>(
    OFFERING_ENROLLMENTS_BY_OFFERING(offeringId),
  );
  return response.data.map((enrollment) => ({
    ...enrollment,
    status: normalizeCourseApplicationStatus(enrollment.status),
  }));
};

export const getOfferingEnrollmentDetails = async (
  enrollmentId: string,
): Promise<OfferingEnrollmentDetail> => {
  const response = await apiClient.get<RawOfferingEnrollmentDetail>(
    OFFERING_ENROLLMENT_DETAILS(enrollmentId),
  );
  return {
    ...response.data,
    status: normalizeCourseApplicationStatus(response.data.status),
  };
};

export const updateOfferingEnrollmentStatus = async (
  enrollmentId: string,
  payload: UpdateEnrollmentStatusPayload,
): Promise<void> => {
  await apiClient.patch<void>(
    OFFERING_ENROLLMENT_STATUS(enrollmentId),
    payload,
  );
};
