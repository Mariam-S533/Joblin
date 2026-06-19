# API Integration Analysis: POST /api/job-posts

> **UPDATE**: The `/api/job-posts/template` endpoint does NOT exist. The form starts with empty state only — no template fetch is needed. All template-related code has been removed.

---

## 1. CLASSIFICATION

| Attribute    | Value                                  |
| ------------ | -------------------------------------- |
| **Module**   | Job Post (Company dashboard)           |
| **Feature**  | `job-post`                             |
| **Category** | Company / Job Management               |
| **Auth**     | Required — Bearer token                |
| **Method**   | POST                                   |
| **Endpoint** | `/api/job-posts`                       |
| **Purpose**  | Create a new job posting for a company |

---

## 2. ARCHITECTURE PLACEMENT

### `/services` → `src/services/jobPostService.ts`

- **Responsibilities**:
  - Define endpoint path constant (`/job-posts`)
  - Call `apiClient.post<SubmitJobPostResponse>()` with normalized payload
  - Unwrap `response.data` from the `ApiResponse<T>` envelope
  - **NEW**: Transform `CreateJobPostFormPayload` (form state) → `CreateJobPostApiPayload` (API contract) before sending

### `/hooks` → `src/hooks/jobPost.ts`

- **`useSubmitJobPost()`** — `useMutation` wrapping `submitJobPost` service
  - **MUST** invalidate `queryKeys.postedJobs.all` on success (currently missing)
  - **MUST** invalidate `queryKeys.jobPost.template` on success if template contains dynamic data
- **`useJobPostTemplate()`** — `useQuery` wrapping `getJobPostTemplate` service (unchanged)

### `/lib/apiClient` → No changes needed

- `apiClient.post` already handles auth token injection, JSON serialization, and envelope normalization

### `/types` → `src/features/job-post/types.ts`

- **NEW**: `CreateJobPostApiPayload` — exact mirror of the API request body contract
- **NEW**: `CreateJobPostFormPayload` — form-local state type (what the UI collects)
- **KEEP**: `JobPostTemplate` — template response from GET endpoint (may need updating)
- **UPDATE**: `SubmitJobPostResponse` — needs backend confirmation
- **REMOVE**: `JobPostPayload = JobPostTemplate` alias (this is the root cause of the mismatch)

### `/features/job-post/utils.ts` — **NEW FILE**

- `mapFormToApiPayload()` — transforms `CreateJobPostFormPayload` → `CreateJobPostApiPayload`
- This is the normalization layer that bridges UI form state to API contract

---

## 3. DATA CONTRACT ANALYSIS

### API Request Body (POST /api/job-posts)

```typescript
{
  title: string,              // REQUIRED
  description: string | null, // optional
  requirements: string | null, // optional
  responsibilities: string | null, // optional
  domain: string | null,      // optional
  country: string,            // REQUIRED
  city: string,               // REQUIRED
  street: string | null,      // optional
  reqExpYears: number,        // optional (default 0?)
  minSalary: string,          // optional — REQUIRES BACKEND CONFIRMATION: should this be number?
  maxSalary: string,          // optional — REQUIRES BACKEND CONFIRMATION: should this be number?
  salaryCurrency: string | null, // optional
  visaSponsorship: boolean,   // optional (default true?)
  contactMail: string | null, // optional
  deadline: string | null,    // optional — REQUIRES BACKEND CONFIRMATION: ISO date? format?
  technicalDomain: string,    // REQUIRED
  jobType: string,            // REQUIRED
  workMode: string,           // REQUIRED
  experienceLevel: string,    // REQUIRED
  requiredSkillIds: string[], // optional — array of skill IDs
}
```

**Required fields**: `city`, `country`, `experienceLevel`, `jobType`, `technicalDomain`, `title`, `workMode`

### Critical Mismatches with Current Code

| #   | Current Code Field                                      | API Field                                           | Issue                                                  |
| --- | ------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| 1   | `jobTitle`                                              | `title`                                             | **Naming mismatch** — different property name          |
| 2   | `jobCategory`                                           | `technicalDomain`                                   | **Semantic mismatch** — category vs technical domain   |
| 3   | `organizationIndustry`                                  | `domain`                                            | **Semantic mismatch** — industry vs domain             |
| 4   | `selectedEmploymentTypes`                               | `jobType`                                           | **Shape mismatch** — array of strings vs single string |
| 5   | (none)                                                  | `workMode`                                          | **Missing field** — no equivalent in current code      |
| 6   | `selectedExperienceLevels`                              | `experienceLevel`                                   | **Shape mismatch** — array vs single string            |
| 7   | `jobDescriptionAndRequiredSkills`                       | `description` + `requirements` + `responsibilities` | **Split mismatch** — 1 field vs 3 separate fields      |
| 8   | `minimumSalaryAmount`                                   | `minSalary` + `maxSalary`                           | **Shape mismatch** — 1 field vs 2 range fields         |
| 9   | (none)                                                  | `salaryCurrency`                                    | **Missing field**                                      |
| 10  | (none)                                                  | `visaSponsorship`                                   | **Missing field**                                      |
| 11  | (none)                                                  | `contactMail`                                       | **Missing field**                                      |
| 12  | (none)                                                  | `deadline`                                          | **Missing field**                                      |
| 13  | (none)                                                  | `street`                                            | **Missing field**                                      |
| 14  | (none)                                                  | `reqExpYears`                                       | **Missing field**                                      |
| 15  | `languageSkills`/`softwareSkills`/`communicationSkills` | `requiredSkillIds`                                  | **Shape mismatch** — SkillPair objects vs string IDs   |
| 16  | `selectedLocations`                                     | `country` + `city`                                  | **Shape mismatch** — badge array vs flat strings       |
| 17  | `displaySalaryInPost`                                   | (none)                                              | **Extra field** — not in API contract                  |
| 18  | `selectedSalaryBadges`                                  | (none)                                              | **Extra field** — not in API contract                  |
| 19  | `organizationalLevel`                                   | (none)                                              | **Extra field** — not in API contract                  |
| 20  | `department`                                            | (none)                                              | **Extra field** — not in API contract                  |

### REQUIRES BACKEND CONFIRMATION

1. **`minSalary` / `maxSalary`**: Shown as `string` (`""`) in the example — salaries are typically `number`. Is this actually `number` or `string`? If `string`, what format?
2. **`reqExpYears`**: Shown as `0` — is this required? What's the default? Is `0` valid for "no experience required"?
3. **`deadline`**: What date format? ISO 8601? `YYYY-MM-DD`? String timestamp?
4. **`visaSponsorship`**: Shown as `true` — is this required? What's the default for new posts?
5. **`jobType` / `workMode` / `experienceLevel` / `technicalDomain`**: What are the valid enum values? Are they free-form strings or constrained?
6. **`requiredSkillIds`**: How are skill IDs obtained? Is there a `/skills` endpoint to query available skills? Are these UUIDs or integer IDs?
7. **Response shape**: What does the API return on success? The full created job object? Just `{id, message}`? An enveloped response?
8. **Template endpoint**: Does `GET /JobPost/template` actually exist? What does it return?

---

## 4. FRONTEND INTEGRATION PLAN

### Hook Design

```typescript
// useSubmitJobPost — mutation
export const useSubmitJobPost = () => {
  const queryClient = useQueryClient();
  return useMutation<SubmitJobPostResponse, Error, CreateJobPostFormPayload>({
    mutationFn: (formData) => {
      const apiPayload = mapFormToApiPayload(formData);
      return submitJobPost(apiPayload);
    },
    onSuccess: () => {
      // Invalidate posted-jobs list so the new job appears
      queryClient.invalidateQueries({ queryKey: queryKeys.postedJobs.all });
      // Invalidate template if it contains dynamic data (e.g., available skills)
      queryClient.invalidateQueries({ queryKey: queryKeys.jobPost.template });
    },
  });
};
```

### Service Responsibilities

```typescript
// jobPostService.ts
const endpoints = {
  template: "/job-posts/template", // REQUIRES BACKEND CONFIRMATION
  submit: "/job-posts",
};

export const submitJobPost = async (payload: CreateJobPostApiPayload) => {
  const response = await apiClient.post<SubmitJobPostResponse>(
    endpoints.submit,
    payload,
  );
  return response.data;
};
```

- Service receives **already-normalized** `CreateJobPostApiPayload` (not raw form state)
- Service does NOT do form→API transformation — that belongs in `utils.ts`
- Service only handles the HTTP call and envelope unwrapping

### API Response Normalization Strategy

- `apiClient` already auto-wraps flat responses into `ApiResponse<T>`
- Service unwraps via `response.data`
- If the backend returns the full created job object, we may need a `normalizeJobPostResponse()` function to map backend field names to frontend conventions
- **REQUIRES BACKEND CONFIRMATION** before implementing response normalization

### Caching Strategy

| Query Key                 | Stale Time | Cache Time | Refetch Policy  |
| ------------------------- | ---------- | ---------- | --------------- |
| `jobPost.template`        | 30 min     | 60 min     | staleTime-based |
| `postedJobs.list(params)` | 2 min      | 5 min      | staleTime-based |

### Invalidation Rules

| Mutation        | On Success Invalidates               |
| --------------- | ------------------------------------ |
| `submitJobPost` | `postedJobs.all`, `jobPost.template` |

### Loading/Error/Empty States

- **Loading**: `submitMutation.isPending` → show spinner on submit button, disable form fields
- **Error**: `submitMutation.error` → display error banner using `getErrorMessage()`
- **Success**: `submitMutation.isSuccess` → show success toast/banner, redirect to posted-jobs page
- **Empty**: Not applicable (this is a creation mutation, not a list query)

### Optimistic Updates

- **NOT recommended** for job post creation. Creating a job post is a one-time action with a complex payload. If the API fails, rolling back optimistic state is error-prone. Instead, invalidate `postedJobs` on success and let React Query refetch naturally.

---

## 5. REAL API COMPATIBILITY REVIEW

### Can the frontend safely consume the API?

**NO — not without a transformation layer.** The current `JobPostPayload = JobPostTemplate` alias sends the raw template/form state directly to the API. This means:

- Field names don't match (`jobTitle` vs `title`, etc.)
- Field shapes don't match (arrays vs single strings)
- Required fields are different
- Extra UI-only fields are sent that the API doesn't expect
- Missing API-required fields aren't sent

### Is response normalization required?

**YES** — once the response shape is confirmed. The current `SubmitJobPostResponse` is a guess. If the backend returns the full job object, field name mapping will be needed.

### May the API response structure break the frontend?

**YES** — if the backend returns unexpected fields or uses different naming conventions (e.g., `job_title` vs `jobTitle`, PascalCase vs camelCase). The `apiClient` doesn't do field-level name transformation.

### Is an additional transformation layer needed?

**YES** — a `utils.ts` file with `mapFormToApiPayload()` is **mandatory**. This is the critical missing piece. Without it, the form state (which serves UI needs) is sent directly to an API that expects a completely different shape.

---

## 6. PROBLEMS & FIXES

### Architectural Issues

| #   | Issue                                                                 | Severity     | Fix                                                                           |
| --- | --------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------- |
| 1   | `JobPostPayload = JobPostTemplate` — payload is identical to template | **CRITICAL** | Create separate `CreateJobPostApiPayload` type matching the real API contract |
| 2   | No transformation layer between form state and API payload            | **CRITICAL** | Add `src/features/job-post/utils.ts` with `mapFormToApiPayload()`             |
| 3   | Service sends raw form state to API                                   | **CRITICAL** | Service should receive pre-normalized `CreateJobPostApiPayload`               |
| 4   | `useSubmitJobPost` doesn't invalidate `postedJobs` cache              | **HIGH**     | Add `onSuccess` invalidation for `queryKeys.postedJobs.all`                   |
| 5   | Endpoint path `/JobPost` vs `/job-posts`                              | **MEDIUM**   | Update endpoint constant to match real API route                              |

### Naming Issues

| #   | Issue                                                             | Fix                              |
| --- | ----------------------------------------------------------------- | -------------------------------- |
| 1   | `jobTitle` → API expects `title`                                  | Map in `mapFormToApiPayload()`   |
| 2   | `jobCategory` → API expects `technicalDomain`                     | Map in `mapFormToApiPayload()`   |
| 3   | `organizationIndustry` → API expects `domain`                     | Map in `mapFormToApiPayload()`   |
| 4   | `minimumSalaryAmount` → API expects `minSalary` + `maxSalary`     | Map in `mapFormToApiPayload()`   |
| 5   | `jobDescriptionAndRequiredSkills` → API expects 3 separate fields | Split in `mapFormToApiPayload()` |

### Type Safety Issues

| #   | Issue                                                                         | Fix                                                             |
| --- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- | ------ | --------------------- |
| 1   | `minSalary`/`maxSalary` shown as `string` but semantically should be `number` | REQUIRES BACKEND CONFIRMATION; define as `string                | number | null` until confirmed |
| 2   | `requiredSkillIds: string[]` — how to get valid IDs?                          | Need a skills query endpoint or template data                   |
| 3   | `jobType`, `workMode`, `experienceLevel` — no enum constraints                | Define string literal unions once backend confirms valid values |
| 4   | `SubmitJobPostResponse` is a guess                                            | Mark all fields optional until backend confirms                 |

### Missing Normalization Layer

- **No `mapFormToApiPayload()` function exists** — this is the single biggest gap
- The page component at [`post-job/page.tsx`](<src/app/(company)/(dashboard)/company/post-job/page.tsx:285>) does `const payload: JobPostPayload = { ...state }` which spreads raw form state as the API payload
- This sends 20+ fields the API doesn't expect and omits fields the API requires

### React Query Anti-Patterns

| #   | Anti-Pattern                           | Fix                                                                                             |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | Mutation with no cache invalidation    | Add `onSuccess` invalidation for `postedJobs.all`                                               |
| 2   | No `mutationKey` on `useSubmitJobPost` | Not strictly required for single-use mutations, but adding it enables `reset()` on the mutation |

### Frontend Integration Risks

| #   | Risk                                                            | Mitigation                                                    |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Form UI collects different data than API expects                | `mapFormToApiPayload()` bridges the gap                       |
| 2   | Skill IDs must be resolved from names/levels                    | Need skill lookup endpoint or template inclusion              |
| 3   | `selectedEmploymentTypes` (array) → `jobType` (string)          | Must pick primary type or join; REQUIRES BACKEND CONFIRMATION |
| 4   | `selectedExperienceLevels` (array) → `experienceLevel` (string) | Must pick primary level; REQUIRES BACKEND CONFIRMATION        |
| 5   | Single description field → 3 separate API fields                | Need UI redesign or smart splitting heuristic                 |

### API Contract Risks

| #   | Risk                                                                                | Action                                                     |
| --- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | Response shape unknown                                                              | REQUIRES BACKEND CONFIRMATION                              |
| 2   | Salary type ambiguity (string vs number)                                            | REQUIRES BACKEND CONFIRMATION                              |
| 3   | Enum values unknown for `jobType`, `workMode`, `experienceLevel`, `technicalDomain` | REQUIRES BACKEND CONFIRMATION                              |
| 4   | `requiredSkillIds` source unknown                                                   | REQUIRES BACKEND CONFIRMATION — need skill lookup endpoint |
| 5   | Template endpoint existence unknown                                                 | REQUIRES BACKEND CONFIRMATION                              |

---

## 7. FINAL OUTPUT

### Recommended File Structure

```
src/
  features/
    job-post/
      types.ts          ← UPDATED (separate API payload from form/template types)
      utils.ts          ← NEW (mapFormToApiPayload transformation)
  services/
    jobPostService.ts   ← UPDATED (correct endpoint, accept CreateJobPostApiPayload)
  hooks/
    jobPost.ts          ← UPDATED (invalidation, accept form payload + transform)
  lib/
    queryKeys.ts        ← UPDATED (add jobPost.submit key if needed)
```

### Service Function Signatures

```typescript
// src/services/jobPostService.ts

export const getJobPostTemplate = async (): Promise<JobPostTemplate> => {
  const response = await apiClient.get<JobPostTemplate>(endpoints.template);
  return response.data;
};

export const submitJobPost = async (
  payload: CreateJobPostApiPayload,
): Promise<SubmitJobPostResponse> => {
  const response = await apiClient.post<SubmitJobPostResponse>(
    endpoints.submit,
    payload,
  );
  return response.data;
};
```

### Hook Signatures

```typescript
// src/hooks/jobPost.ts

export const useJobPostTemplate = () =>
  useQuery({
    queryKey: queryKeys.jobPost.template,
    queryFn: getJobPostTemplate,
  });

export const useSubmitJobPost = () => {
  const queryClient = useQueryClient();
  return useMutation<SubmitJobPostResponse, Error, CreateJobPostFormPayload>({
    mutationFn: (formData) => {
      const apiPayload = mapFormToApiPayload(formData);
      return submitJobPost(apiPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedJobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobPost.template });
    },
  });
};
```

### DTO/Interface Definitions

```typescript
// src/features/job-post/types.ts

// ─── API Payload (exact mirror of POST /api/job-posts contract) ──────

export type CreateJobPostApiPayload = {
  title: string;
  description?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
  domain?: string | null;
  country: string;
  city: string;
  street?: string | null;
  reqExpYears?: number | null;
  minSalary?: string | null; // REQUIRES BACKEND CONFIRMATION: string or number?
  maxSalary?: string | null; // REQUIRES BACKEND CONFIRMATION: string or number?
  salaryCurrency?: string | null;
  visaSponsorship?: boolean | null;
  contactMail?: string | null;
  deadline?: string | null; // REQUIRES BACKEND CONFIRMATION: date format?
  technicalDomain: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  requiredSkillIds?: string[];
};

// ─── Form Payload (what the UI collects) ─────────────────────────────

export type CreateJobPostFormPayload = {
  title: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  domain?: string;
  country: string;
  city: string;
  street?: string;
  reqExpYears?: number;
  minSalary?: string;
  maxSalary?: string;
  salaryCurrency?: string;
  visaSponsorship?: boolean;
  contactMail?: string;
  deadline?: string;
  technicalDomain: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  requiredSkillIds?: string[];
};

// ─── Response (REQUIRES BACKEND CONFIRMATION) ────────────────────────

export type SubmitJobPostResponse = {
  id?: string;
  message?: string;
  // REQUIRES BACKEND CONFIRMATION: full job object? just id? status?
};

// ─── Template (from GET endpoint — REQUIRES BACKEND CONFIRMATION) ────

export type JobPostTemplate = {
  // REQUIRES BACKEND CONFIRMATION: what does the template endpoint return?
  // Likely: available enum values for jobType, workMode, experienceLevel, technicalDomain
  // Plus: available skills with IDs for requiredSkillIds selection
  jobTypes?: string[];
  workModes?: string[];
  experienceLevels?: string[];
  technicalDomains?: string[];
  salaryCurrencies?: string[];
  skills?: { id: string; name: string }[];
};
```

### Integration/Refactor Instructions

1. **Update `src/features/job-post/types.ts`**:
   - Remove `JobPostPayload = JobPostTemplate` alias
   - Add `CreateJobPostApiPayload` matching the real API contract
   - Add `CreateJobPostFormPayload` for UI form state
   - Update `SubmitJobPostResponse` with optional fields + "REQUIRES BACKEND CONFIRMATION"
   - Update `JobPostTemplate` to reflect likely template data (enum options, skills)
   - Remove old enum types (`EmploymentType`, `ExperienceLevel`, etc.) that don't match API values

2. **Create `src/features/job-post/utils.ts`**:
   - Add `mapFormToApiPayload(form: CreateJobPostFormPayload): CreateJobPostApiPayload`
   - Handle null/undefined normalization (empty string → null for optional fields)
   - Handle type conversions (string salary → string as-is until backend confirms)

3. **Update `src/services/jobPostService.ts`**:
   - Change endpoint from `/JobPost` to `/job-posts`
   - Change `submitJobPost` parameter from `JobPostPayload` to `CreateJobPostApiPayload`
   - Keep `getJobPostTemplate` but update endpoint path

4. **Update `src/hooks/jobPost.ts`**:
   - `useSubmitJobPost` must accept `CreateJobPostFormPayload`
   - Call `mapFormToApiPayload()` inside `mutationFn`
   - Add `onSuccess` invalidation for `postedJobs.all` and `jobPost.template`

5. **Update `src/app/(company)/(dashboard)/company/post-job/page.tsx`**:
   - Replace `JobPostLocalState = JobPostTemplate` with `CreateJobPostFormPayload`-based local state
   - Remove spreading raw state as payload: `const payload: JobPostPayload = { ...state }`
   - Use `submitMutation.mutate(state)` — the hook now handles transformation
   - Update validation to match new required fields: `title`, `country`, `city`, `technicalDomain`, `jobType`, `workMode`, `experienceLevel`
   - Add form fields for missing API fields: `workMode`, `visaSponsorship`, `contactMail`, `deadline`, `minSalary/maxSalary`, `salaryCurrency`, `street`, `reqExpYears`, `requiredSkillIds`

6. **Update `src/lib/queryKeys.ts`**:
   - Consider adding `jobPost.submit` key for mutation tracking (optional)

### Frontend Implementation Recommendations

1. **Do NOT send UI-only fields to the API** — `displaySalaryInPost`, `selectedSalaryBadges`, `selectedLocations`, `organizationalLevel`, `department` are UI concerns only. The `mapFormToApiPayload()` function must strip these.

2. **Resolve the array→string mismatch** — If the API truly expects a single `jobType` string, the UI should use a single-select dropdown (not multi-select checkboxes). If the backend actually accepts arrays, the contract is wrong. **REQUIRES BACKEND CONFIRMATION**.

3. **Skill ID resolution** — The form must let users select skills from a predefined list (returned by template or a dedicated endpoint) and collect the IDs, not free-text skill names.

4. **Salary range** — Replace the single `minimumSalaryAmount` field with `minSalary` + `maxSalary` range inputs plus a `salaryCurrency` selector.

5. **Description splitting** — Replace the single `jobDescriptionAndRequiredSkills` textarea with three separate fields: `description`, `requirements`, `responsibilities`.

6. **Deadline field** — Add a date picker for `deadline` that outputs the format the API expects (ISO 8601 until confirmed).

7. **Keep the template query** — Even if the template endpoint needs updating, it's the right architectural pattern. The template should provide valid enum options and available skills with their IDs.
