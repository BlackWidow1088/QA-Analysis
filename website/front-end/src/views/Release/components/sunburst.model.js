
// import { arc } from 'd3';

// export interface Details {
//     name: Status;
//     count: number;
//     flexName: string;
//     device: DeviceType;
// }
// export enum DeviceType {
//     dev1 = 'dev1',
//     dev2 = 'dev2',
//     dev3 = 'dev3',
//     dev4 = 'dev4'
// }
// export enum Status {
//     Fail = 'Fail',
//     Warning = 'Warning',
//     Pass = 'Pass'
// }
// export interface SunburstData {
//     data: any;
//     componentType: DeviceType;
// }
// export class SunburstArcData {
//     id: string;
//     rule: Details;
//     parent: string;
//     color: string;
//     startAngle: number;
//     endAngle: number;
//     innerRadius: number;
//     outerRadius: number;
// }
// export const DetailsInfo = {
//     Fail: { color: '#ED6648', display: 'Fail' },
//     Warning: { color: '#F9D55B', display: 'Warning' },
//     Pass: { color: '#68C083', display: 'Pass' }
// };
// export const arcGenerator = arc();
// export const innerarc = arc().innerRadius(30).outerRadius(35);
// export const expander = arc()
//     .innerRadius(d => {
//         return (d.innerRadius = d.parent ? d.innerRadius : d.innerRadius);
//     })
//     .outerRadius(d => {
//         return (d.outerRadius += 10);
//     });

// export const collapser = arc()
//     .innerRadius(d => {
//         return (d.innerRadius = d.parent ? d.innerRadius : d.innerRadius);
//     })
//     .outerRadius(d => {
//         return (d.outerRadius -= 10);
//     });
