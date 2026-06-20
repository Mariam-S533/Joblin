import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOfferingEnrollments,
  getOfferingEnrollmentDetails,
  updateOfferingEnrollmentStatus,
} from "@/services/courseApplicationsService";
import type { CourseApplicationStatus, UpdateEnrollmentStatusPayload } from "@/features/course-applications/types";

import { queryKeys } from "@/lib/queryKeys";

export const useOfferingEnrollments = (offeringId: string) =>
  useQuery({
    queryKey: queryKeys.courseApplications.enrollmentsByOffering(offeringId),
    queryFn: () => getOfferingEnrollments(offeringId),
    enabled: !!offeringId,
  });

export const useOfferingEnrollmentDetails = (
  enrollmentId: string,
  enabled?: boolean,
) =>
  useQuery({
    queryKey: queryKeys.courseApplications.enrollmentDetails(enrollmentId),
    queryFn: () => getOfferingEnrollmentDetails(enrollmentId),
    enabled: enabled !== false && !!enrollmentId,
  });

type EnrollmentStatusUpdateVariables = {
  enrollmentId: string;
  offeringId: string;
  payload: UpdateEnrollmentStatusPayload;
};

export function useUpdateEnrollmentStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, EnrollmentStatusUpdateVariables>({
    mutationFn: ({ enrollmentId, payload }) =>
      updateOfferingEnrollmentStatus(enrollmentId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseApplications.enrollmentsByOffering(variables.offeringId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courseApplications.enrollmentDetails(variables.enrollmentId),
      });
    },
    onError: () => {
      toast.error("Failed to update enrollment status");
    },
  });
}
