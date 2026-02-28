### Task Overview

Utkrusht provides real-time assessment analytics dashboards for agile teams, showing many small metric widgets at once. The current React + TypeScript implementation in this project is fully functional and type-safe, but under heavier load it triggers a large number of parallel API calls and repeated expensive computations in each widget, which will not scale well and can cause API rate-limit issues in a real backend. This is a 30-minute optimization task where you will focus on making rendering and data fetching more efficient without changing the existing behavior or breaking type safety.

### Helpful Tips

- Consider how React's rendering cycle impacts performance when many widgets are rendered at once
- Consider when child components re-render due to parent state changes and prop updates
- Consider how often inline functions and derived values are recreated on each render
- Think about when and how API calls are triggered and whether multiple calls can be avoided or consolidated
- Think about how to avoid recalculating expensive values when the inputs have not changed
- Explore React's built-in optimization hooks and component memoization features where appropriate
- Explore whether data can be shared between widgets instead of fetched repeatedly in similar ways
- Review how state is structured so that changes update only the components that need to re-render
- Review TypeScript types to keep everything safe and consistent while refactoring
- Review browser DevTools (Network and Profiler) to compare behavior before and after your changes

### Objectives

- Reduce unnecessary component re-renders, especially for individual widget components
- Optimize API call patterns so that redundant or excessive calls are minimized
- Improve perceived UI responsiveness when changing the time range or refreshing data
- Maintain existing functionality and behavior of the dashboard while improving performance
- Maintain strict TypeScript type safety during all refactors and optimizations
- Apply React performance best practices in the most critical rendering and data-fetching paths

### How to Verify

- Use the React DevTools Profiler to observe render counts for the dashboard and widgets before and after your changes
- Review the Network tab to see how many API calls are made when the dashboard loads or when the time range changes
- Interact with the time range selector and the refresh actions and observe whether the UI feels more responsive
- Confirm that TypeScript compilation still passes with no errors after your changes
- Confirm that `npm start` runs without runtime errors or new console warnings
- Verify that all widgets still display data correctly and that refresh and time range changes still work
- Compare overall behavior and responsiveness before and after your optimizations to ensure measurable improvement
