# Overview

I created a donation form that allows user to make donations to fundraiser.
I displayed a list of recent donations for the fundraiser.

## What I have done

1. Improved Typescript for overall project.
2. Improved Error handling.
3. Added Donation Form component in `FundraiserDetailScreen.tsx`.
    - Amount input field (numeric, required)
    - Donor name input field (required)
    - Optional message/comment field
    - Submit button
4. Used `react-hook-form`, `zod` for form validation .
5. Added Donation List component.
    - Smooth list animations when new donations are added.
    - Pull-to-refresh functionality.
    - Empty state when there are no donations.
    - Nice visual design that matches the app's style.
6. Added Custom toast component to show error messages properly.
7. Implemented smooth animations when showing success / error states.
8. Defined global theme.

