# 🔍 Full Project Audit Report — Joblin Front-End

> **Audit Date**: 2026-05-26  
> **Scope**: Every file in `src/` (lib, services, hooks, features, components, pages, types, infrastructure)  
> **Principle**: **UI → Hook → Service → apiClient → Real API** — no exceptions

---

## 📊 Executive Summary

| Category | Violation Count | Severity |
|----------|----------------|----------|
| Architecture Chain Breaks | 8 | 🔴 Critical |
| Mock / Inline Data | 9 | 🔴 Critical |
| Type System Violations | 7 | 🟡 High |
| Code Quality Violations | 12 | 🟡 High |
| Project Structure Violations | 2 | 🟠 Medium |

**Total Violations: 38**

---

## 1. 🔴 ARCHITECTURE CHAIN BREAKS (UI → Hook → Service → apiClient → Real API)

### 1a. Raw `fetch()` Bypassing Entire Chain — CRITICAL

| File | Line(s) | Violation | Current Flow | Required Flow |
|------|---------|-----------|--------------|---------------|
| [`register/company/page.tsx`](src/app/(auth)/register/company/page.tsx) | 47–74 | Uses raw `fetch("http://localhost:5246/api/Authentication/register-company")` | Page → raw fetch → localhost URL | Page → useRegisterCompany mutation → authService → apiClient → proxy route |
| [`register/job-seeker/page.tsx`](src/app/(auth)/register/job-seeker/page.tsx) | 45–72 | Uses raw `fetch("https://pnm6zhh3-7127.uks1.devtunnels.ms/api/Authentication/register-seeker")` | Page → raw fetch → dev tunnel URL | Page → useRegisterSeeker mutation → authService → apiClient → proxy route |

**Impact**: These two pages completely bypass the apiClient, service layer, hook layer, AND the Next.js proxy route. They hardcode backend URLs that will break in production.

### 1b. Zero API Calls — Only `console.log` — CRITICAL

| File | Line(s) | Violation | Current Behavior | Required Behavior |
|------|---------|-----------|------------------|-------------------|
| [`forget-pass/page.tsx`](src/app/(auth)/forget-pass/page.tsx) | onSubmit | `console.log(data)` — no API call | Logs to console, does nothing | Page → useForgotPassword mutation → authService.forgotPassword → apiClient → API |
| [`reset-pass/page.tsx`](src/app/(auth)/reset-pass/page.tsx) | onSubmit | `console.log(data)` — no API call | Logs to console, does nothing | Page → useResetPassword mutation → authService.resetPassword → apiClient → API |
| [`verify-email/page.tsx`](src/app/(auth)/verify-email/page.tsx) | onSubmit | `console.log(codeObj)` — no API call | Logs to console, does nothing | Page → useVerifyEmail mutation → authService.verifyEmail → apiClient → API |

**Impact**: These three pages are completely non-functional. Users clicking submit will see nothing happen.

### 1c. Manual `useState` Loading Instead of React Query Mutations

| File | Violation | Required Pattern |
|------|-----------|------------------|
| [`register/company/page.tsx`](src/app/(auth)/register/company/page.tsx) | `useState` for `isLoading`, manual error handling | `useMutation` hook with `isPending`, `isError`, `isSuccess` |
| [`register/job-seeker/page.tsx`](src/app/(auth)/register/job-seeker/page.tsx) | `useState` for `isLoading`, manual error handling | `useMutation` hook with `isPending`, `isError`, `isSuccess` |
| [`forget-pass/page.tsx`](src/app/(auth)/forget-pass/page.tsx) | `useState` for `isLoading` | `useMutation` hook |
| [`reset-pass/page.tsx`](src/app/(auth)/reset-pass/page.tsx) | `useState` for `isLoading` | `useMutation` hook |
| [`verify-email/page.tsx`](src/app/(auth)/verify-email/page.tsx) | `useState` for `isLoading` | `useMutation` hook |
| [`login/company/page.tsx`](src/app/(auth)/login/company/page.tsx) | `useState` for `isLoading` | `useMutation` hook (or NextAuth `signIn` wrapped in mutation) |
| [`login/job-seeker/page.tsx`](src/app/(auth)/login/job-seeker/page.tsx) | `useState` for `isLoading` | `useMutation` hook (or NextAuth `signIn` wrapped in mutation) |

**Impact**: All auth pages manually manage loading/error state with `useState` instead of leveraging React Query's built-in state management. This creates inconsistent patterns across the app.

### 1d. Hook Contains Navigation Logic — VIOLATION

| File | Line(s) | Violation | Required Fix |
|------|---------|-----------|--------------|
| [`useLogout.ts`](src/hooks/useLogout.ts) | Entire file | Contains `useRouter()` and `window.location.href` for navigation. Hook should return mutation only — no JSX, no toast, no navigation. | Remove navigation from hook. Page/component should call `mutate()` then handle `onSuccess` navigation. |

### 1e. Endpoints Not Centralized

| File | Violation | Required Fix |
|------|-----------|--------------|
| [`authService.ts`](src/services/authService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`companyHomeService.ts`](src/services/companyHomeService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`companyProfileService.ts`](src/services/companyProfileService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`companySettingsService.ts`](src/services/companySettingsService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`courseApplicationsService.ts`](src/services/courseApplicationsService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`coursePostService.ts`](src/services/coursePostService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`jobApplicationsService.ts`](src/services/jobApplicationsService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`jobPostService.ts`](src/services/jobPostService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`postedCoursesService.ts`](src/services/postedCoursesService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`postedJobsService.ts`](src/services/postedJobsService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |
| [`skillsService.ts`](src/services/skillsService.ts) | Local `endpoints` object | Move to `src/lib/apiClient/endpoints.ts` |

**Impact**: 11 separate endpoint definitions scattered across service files. No single source of truth for API routes. Risk of duplication and inconsistency.

---

## 2. 🔴 MOCK / INLINE DATA VIOLATIONS

### 2a. Hardcoded Badge / Notification Counts

| File | Line(s) | Hardcoded Value | Required Fix |
|------|---------|-----------------|--------------|
| [`CompanyNavbar.tsx`](src/components/Navbar/CompanyNavbar.tsx) | Badge count | `12` | Derive from API data via hook |
| [`DashboardHeader.tsx`](src/components/Navbar/DashboardHeader.tsx) | `notificationCount` | `30` | Derive from API data via hook |
| [`JobseekerNavbar.tsx`](src/components/Navbar/JobseekerNavbar.tsx) | User name | `"User"` | Derive from session/auth data |
| [`JobseekerNavbar.tsx`](src/components/Navbar/JobseekerNavbar.tsx) | User email | `"mariam232@gmail.com"` | Derive from session/auth data |
| [`JobseekerNavbar.tsx`](src/components/Navbar/JobseekerNavbar.tsx) | Badge count | `12` | Derive from API data via hook |
| [`CompanySidebar.tsx`](src/components/Sidebar/CompanySidebar.tsx) | Job applications badge | `6` | Derive from API data via hook |
| [`CompanySidebar.tsx`](src/components/Sidebar/CompanySidebar.tsx) | Course applications badge | `24` | Derive from API data via hook |

### 2b. Hardcoded Chart Data

| File | Line(s) | Violation | Required Fix |
|------|---------|-----------|--------------|
| [`ChartAreaDefaul.tsx`](src/components/PieChart/ChartAreaDefaul.tsx) | `chartData` array | Inline hardcoded data array | Accept data via props from page (which gets it from hook → service → apiClient) |
| [`ChartPieDonutText.tsx`](src/components/PieChart/ChartPieDonutText.tsx) | `chartData` array | Inline hardcoded data array | Accept data via props from page (which gets it from hook → service → apiClient) |

### 2c. Hardcoded Fallback Values

| File | Line(s) | Hardcoded Value | Required Fix |
|------|---------|-----------------|--------------|
| [`posted-jobs/[jobId]/applications/page.tsx`](src/app/(company)/(dashboard)/company/posted-jobs/[jobId]/applications/page.tsx) | Lines 367, 495 | `"UI/UX Designer"` as fallback job title | Use actual job title from API data; use empty string or "Untitled" as generic fallback |
| [`company-settings/utils.ts`](src/features/company-settings/utils.ts) | `FALLBACK_LOGO_URL` | Hardcoded fallback logo URL | Move to shared constants or use `""` as fallback |
| [`company-profile/utils.ts`](src/features/company-profile/utils.ts) | `FALLBACK_LOGO_URL` | Hardcoded fallback logo URL | Move to shared constants or use `""` as fallback |
| [`HeaderCard.tsx`](src/components/HeaderCard.tsx) | `FALLBACK_LOGO_URL` | Hardcoded fallback logo URL | Move to shared constants or use `""` as fallback |

### 2d. Hardcoded URLs

| File | Hardcoded URL | Required Fix |
|------|---------------|--------------|
| [`register/company/page.tsx`](src/app/(auth)/register/company/page.tsx) | `http://localhost:5246/api/Authentication/register-company` | Use apiClient → proxy route (already configured in `apiClient/config.ts`) |
| [`register/job-seeker/page.tsx`](src/app/(auth)/register/job-seeker/page.tsx) | `https://pnm6zhh3-7127.uks1.devtunnels.ms/api/Authentication/register-seeker` | Use apiClient → proxy route |

### 2e. Hardcoded Timer Text

| File | Line(s) | Hardcoded Value | Required Fix |
|------|---------|-----------------|--------------|
| [`verify-email/page.tsx`](src/app/(auth)/verify-email/page.tsx) | Timer display | `"4:59"` hardcoded countdown text | Implement actual countdown timer with `useState` + `useEffect` |

---

## 3. 🟡 TYPE SYSTEM VIOLATIONS

### 3a. Duplicate Type Definitions

| File | Violation | Duplicates | Required Fix |
|------|-----------|------------|--------------|
| [`src/app/Types/login.ts`](src/app/Types/login.ts) | Defines `successLoginResponse` and related types | [`src/features/auth/types.ts`](src/features/auth/types.ts) already defines `AuthUserResponse` and login types | Delete `src/app/Types/login.ts`; update all imports to use `src/features/auth/types.ts` |

### 3b. Cross-Feature Type Dependencies

| File | Violation | Imported By | Required Fix |
|------|-----------|-------------|--------------|
| [`src/features/posted-jobs/types.ts`](src/features/posted-jobs/types.ts) | Defines `PaginationMeta` and `Department` as posted-jobs-specific types | [`posted-courses/types.ts`](src/features/posted-courses/types.ts) and [`course-applications/types.ts`](src/features/course-applications/types.ts) import them | Move `PaginationMeta` and `Department` to a shared types file (e.g., `src/features/shared/types.ts`) |

### 3c. Inline Interface Definitions in Pages

| File | Inline Interface | Required Fix |
|------|-----------------|--------------|
| [`register/company/page.tsx`](src/app/(auth)/register/company/page.tsx) | `interface Inputs` (lines 24–31) | Move to `src/features/auth/types.ts` as `CompanyRegisterInputs` |
| [`register/job-seeker/page.tsx`](src/app/(auth)/register/job-seeker/page.tsx) | `interface Inputs` (lines 24–30) | Move to `src/features/auth/types.ts` as `SeekerRegisterInputs` |
| [`login/company/page.tsx`](src/app/(auth)/login/company/page.tsx) | `interface Inputs` (lines 19–22) | Move to `src/features/auth/types.ts` as `CompanyLoginInputs` |
| [`login/job-seeker/page.tsx`](src/app/(auth)/login/job-seeker/page.tsx) | `interface Inputs` (lines 19–22) | Move to `src/features/auth/types.ts` as `SeekerLoginInputs` |
| [`reset-pass/page.tsx`](src/app/(auth)/reset-pass/page.tsx) | `interface Inputs` (lines 14–17) | Move to `src/features/auth/types.ts` as `ResetPasswordInputs` |
| [`company-info/page.tsx`](src/app/(auth)/company-info/page.tsx) | `interface CompanyInfoInputs` (lines 43–54) | Move to `src/features/auth/types.ts` or `src/features/company-profile/types.ts` |

---

## 4. 🟡 CODE QUALITY VIOLATIONS

### 4a. `console.log` / `console.error` Debug Statements

| File | Type | Required Fix |
|------|------|--------------|
| [`register/company/page.tsx`](src/app/(auth)/register/company/page.tsx) | `console.log` | Remove entirely |
| [`register/job-seeker/page.tsx`](src/app/(auth)/register/job-seeker/page.tsx) | `console.log` | Remove entirely |
| [`login/company/page.tsx`](src/app/(auth)/login/company/page.tsx) | `console.log` | Remove entirely |
| [`login/job-seeker/page.tsx`](src/app/(auth)/login/job-seeker/page.tsx) | `console.log` | Remove entirely |
| [`forget-pass/page.tsx`](src/app/(auth)/forget-pass/page.tsx) | `console.log` | Remove entirely |
| [`reset-pass/page.tsx`](src/app/(auth)/reset-pass/page.tsx) | `console.log` | Remove entirely |
| [`verify-email/page.tsx`](src/app/(auth)/verify-email/page.tsx) | `console.log` | Remove entirely |
| [`company-info/page.tsx`](src/app/(auth)/company-info/page.tsx) | `console.error` | Remove entirely |
| [`company/profile/page.tsx`](src/app/(company)/(dashboard)/company/profile/page.tsx) | `console.error` | Remove entirely |
| [`postedJobsService.ts`](src/services/postedJobsService.ts) | `console.log` | Remove entirely |

### 4b. Commented-Out Code

| File | Required Fix |
|------|--------------|
| [`login/company/page.tsx`](src/app/(auth)/login/company/page.tsx) | Delete all commented-out code blocks |
| [`login/job-seeker/page.tsx`](src/app/(auth)/login/job-seeker/page.tsx) | Delete all commented-out code blocks |

### 4c. Navigation Logic in Pages Instead of Hook `onSuccess`

| File | Violation | Required Fix |
|------|-----------|--------------|
| [`post-job/page.tsx`](src/app/(company)/(dashboard)/company/post-job/page.tsx) | `setTimeout(() => router.push(...))` after mutation success | Use mutation `onSuccess` callback or `useNavigate` hook pattern |

---

## 5. 🟠 PROJECT STRUCTURE VIOLATIONS

### 5a. `src/app/Types/` Directory Violates Enforced Structure

| File | Current Location | Required Location | Notes |
|------|-----------------|-------------------|-------|
| [`src/app/Types/login.ts`](src/app/Types/login.ts) | `src/app/Types/` | `src/features/auth/types.ts` (merge into existing) | Duplicate of auth types — DELETE and merge |
| [`src/app/Types/next-auth.d.ts`](src/app/Types/next-auth.d.ts) | `src/app/Types/` | **KEEP IN PLACE** | NextAuth type augmentation must stay at `src/app/Types/next-auth.d.ts` per NextAuth convention — DO NOT MOVE |

**Action**: Delete `src/app/Types/login.ts`. Keep `src/app/Types/next-auth.d.ts` where it is. The `src/app/Types/` directory will remain with only the NextAuth declaration file.

---

## 6. ✅ CLEAN FILES — No Violations

These files were audited and found to be fully compliant with the architecture rules:

### Lib Layer
- [`apiClient/config.ts`](src/lib/apiClient/config.ts) — Clean. Uses env vars for API base URL.
- [`apiClient/index.ts`](src/lib/apiClient/index.ts) — Clean. Proper fetch wrapper with auth token injection.
- [`apiClient/error.ts`](src/lib/apiClient/error.ts) — Clean. ApiError class and getErrorMessage helper.
- [`apiClient/types.ts`](src/lib/apiClient/types.ts) — Clean. ApiResponse, HttpMethod, ApiClientOptions types.
- [`queryKeys.ts`](src/lib/queryKeys.ts) — Clean. Centralized React Query key definitions.
- [`utils.ts`](src/lib/utils.ts) — Clean. cn() utility for Tailwind.
- [`nextauth.ts`](src/lib/nextauth.ts) — Clean. DO NOT TOUCH per rules.

### Service Layer (Pattern Clean — Only Endpoint Centralization Needed)
- All 11 services use apiClient directly with no mock flags. The only violation is local `endpoints` objects instead of centralized config.

### Hook Layer (Except useLogout)
- All hooks except [`useLogout.ts`](src/hooks/useLogout.ts) are clean — no JSX, no toast, no navigation.

### Feature Types (Except Cross-Feature Dependencies)
- [`enums.ts`](src/features/enums.ts) — Clean. Single source of truth for all backend enum types.
- All feature type files are clean except cross-feature imports noted above.

### Infrastructure
- [`providers.tsx`](src/app/providers.tsx) — Clean.
- [`layout.tsx`](src/app/layout.tsx) — Clean.
- [`AuthProvider.tsx`](src/app/context/AuthProvider.tsx) — Clean.
- [`proxy route`](src/app/api/proxy/[...path]/route.ts) — Clean.
- [`nextauth route`](src/app/api/auth/[...nextauth]/route.ts) — Clean. DO NOT TOUCH.
- Dashboard layout — Clean.
- Public layout — Clean.

### UI Components (shadcn/ui)
- All `src/components/ui/` files — Clean. DO NOT TOUCH per rules.

---

## 7. 📋 PRIORITIZED FIX ORDER

Based on severity and dependency chain:

| Priority | Step | Action | Files Affected |
|----------|------|--------|----------------|
| P0 | 2 | Delete all mock/inline data, hardcoded values | 9 component/page files |
| P0 | 3a | Create centralized `src/lib/apiClient/endpoints.ts` | 11 service files + 1 new file |
| P0 | 3b | Add missing service methods (forgotPassword, resetPassword, verifyEmail, registerCompany, registerSeeker) | `authService.ts` |
| P0 | 3c | Create missing mutation hooks for auth flows | `src/hooks/auth.ts` + potentially new hook files |
| P0 | 3d | Rewrite all auth pages to use mutation hooks | 8 auth page files |
| P0 | 3e | Fix useLogout — remove navigation, return mutation only | `useLogout.ts` |
| P1 | 4 | Move `PaginationMeta`/`Department` to shared types | 3 feature type files + 1 new file |
| P1 | 4 | Delete `src/app/Types/login.ts`, merge into auth types | 1 file deleted, imports updated |
| P1 | 4 | Move inline interfaces from pages to feature types | 6 auth page files + auth types file |
| P1 | 5 | Remove all `console.log`/`console.error` | 10 files |
| P1 | 5 | Delete commented-out code | 2 login page files |
| P1 | 5 | Fix hardcoded fallback values | 4 files |
| P2 | 5 | Fix navigation-in-page pattern (post-job) | 1 file |
| P2 | 5 | Implement actual countdown timer in verify-email | 1 file |

---

## 8. 🔒 DO NOT TOUCH (Per Mandate Rules)

| File/Directory | Reason |
|----------------|--------|
| `src/lib/nextauth.ts` | NextAuth config — working, no changes |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth route — working, no changes |
| `src/app/Types/next-auth.d.ts` | NextAuth type augmentation — must stay in place |
| `src/app/providers.tsx` | Providers — working, no changes |
| `src/app/context/AuthProvider.tsx` | Auth context — working, no changes |
| `src/components/ui/*` | shadcn/ui components — DO NOT TOUCH |
| `src/lib/utils.ts` | cn() utility — working, no changes |
| Sonner/toast setup | Working, no changes |
| UI design/styling | Visual design must not change |
| Working validation logic | Zod/react-hook-form validation must not change |
| Middleware | Not present in project, no changes needed |

---

*End of Audit Report. Proceeding to Step 2: Mock Layer Permanent Removal.*