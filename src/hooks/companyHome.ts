import { useQuery } from "@tanstack/react-query";
import { getCompanyHomeData } from "@/services/companyHomeService";

import { queryKeys } from "@/lib/queryKeys";

export const useCompanyHomeData = () =>
  useQuery({
    queryKey: queryKeys.companyHome.all,
    queryFn: getCompanyHomeData,
  });
