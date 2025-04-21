// // components/ChartWrapper.tsx
// import { forwardRef } from 'react';
// import {
//     Chart as ChartJS,
//     ChartData,
//     ChartOptions,
//     ChartComponent
// } from 'chart.js';
// import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// type ChartTypeKey = 'line' | 'bar' | 'pie' | 'doughnut';

// interface ChartWrapperProps {
//     type: ChartTypeKey;
//     data: ChartData;
//     options?: ChartOptions;
//     className?: string;
// }

// const chartComponents: Record<ChartTypeKey, ChartComponent> = {
//     line: Line,
//     bar: Bar,
//     pie: Pie,
//     doughnut: Doughnut
// };

// const ChartWrapper = forwardRef<ChartJS, ChartWrapperProps>(
//     ({ type, data, options = {}, className }, ref) => {
//         const ChartComponent = chartComponents[type];

//         return (
//             <div className={className}>
//                 <ChartComponent
//                     ref={ref}
//                     type={type}
//                     data={data}
//                     options={options}
//                 />
//             </div>
//         );
//     }
// );

// ChartWrapper.displayName = 'ChartWrapper';

// export default ChartWrapper;