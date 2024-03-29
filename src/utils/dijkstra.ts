/* eslint-disable max-classes-per-file */
import { HeapQueue } from './heap-queue';
// import { type GraphState, initialState } from '@/store/graph';

// interface EdgeInfo {
//   [key: string]: { [key: string]: string };
// }

// type Pair = [number, string];

// export const INFINITY = Math.floor(Number.MAX_SAFE_INTEGER / 987);

// export class Dijkstra {
//   private initGraph: GraphState = initialState;

//   private from = '';

//   private to = '';

//   private graph: EdgeInfo = {};

//   private vertexCount = 0;

//   private dist: { [key: string]: number } = {};

//   constructor(builder: DijkstraBuilder) {
//     this.initGraph = builder.getGraphInfo();
//     this.from = builder.getFromVertex();
//     this.to = builder.getToVertex();
//     this.vertexCount = Number(this.initGraph.vertexCount);
//   }

//   public run() {
//     this.mapping();

//     if (this.isExistVertex() === false) return false;

//     return this.backTracking(this.dijkstra());
//   }

//   public mapping() {
//     Object.entries(this.initGraph.graph).forEach((ele) => {
//       const [currentVertex, value] = ele;

//       if (this.isExceedVertexCount() && value.length <= 0) return;

//       this.graph[currentVertex] = this.graph[currentVertex] || {};

//       value.forEach((ele2) => {
//         const { vertex, cost } = ele2;
//         if (vertex === undefined && cost === undefined) return;

//         if (this.isExceedVertexCount() && !this.graph[vertex]) return;

//         this.graph[vertex] = this.graph[vertex] || {};

//         // 현재 정점과 연결된 정점 객체가 존재하지 않는다면
//         if (Object.keys(this.graph[currentVertex]).includes(vertex) === false) {
//           this.graph[currentVertex][vertex] = cost;
//         }
//         // 양방향으로 연결한다.
//         if (Object.keys(this.graph[vertex]).includes(currentVertex) === false) {
//           this.graph[vertex][currentVertex] = cost;
//         }
//       });
//     });
//   }

//   public dijkstra() {
//     const path: { [key: string]: string } = {};

//     Object.keys(this.graph).forEach((ele) => {
//       this.dist[ele] = this.dist[ele] || INFINITY;
//       path[ele] = path[ele] || ele;
//     });

//     this.dist[this.from] = 0;

//     const pq = new HeapQueue<Pair>((a, b) => a[0] - b[0]);
//     pq.push([0, this.from]);

//     while (!pq.isEmpty()) {
//       const [cost, curVertex] = pq.top();
//       pq.pop();

//       // eslint-disable-next-line no-continue
//       if (this.dist[curVertex] < cost) continue;

//       Object.entries(this.graph[curVertex]).forEach((ele) => {
//         const [nextVertex, tmpcost] = ele;
//         const nextCost = Number(tmpcost) + cost;

//         if (nextCost < this.dist[nextVertex]) {
//           path[nextVertex] = curVertex;
//           this.dist[nextVertex] = nextCost;
//           pq.push([nextCost, nextVertex]);
//         }
//       });
//     }

//     return path;
//   }

//   /** @description 최단경로 역추적하는 함수 */
//   public backTracking(path: { [key: string]: string }) {
//     const ret: { [key: string]: boolean } = {};
//     let x = this.to;

//     while (x !== path[x]) {
//       ret[x] = ret[x] || false;
//       x = path[x];
//     }

//     ret[x] = ret[x] || false;
//     ret[this.to] = true;
//     ret[this.from] = true;

//     return ret;
//   }

//   /** @description from to 정점이 하나라도 없다면 */
//   public isExistVertex() {
//     return Object.keys(this.graph).includes(this.from) && Object.keys(this.graph).includes(this.to);
//   }

//   /** @description 객체 키값 개수가 정점 개수를 초과하는가? */
//   public isExceedVertexCount() {
//     return Object.keys(this.graph).length >= this.vertexCount;
//   }

//   public getDist() {
//     return this.dist;
//   }
// }

// export class DijkstraBuilder {
//   private graphInfo: GraphState = initialState;

//   private from = '';

//   private to = '';

//   public setGraphInfo(graphInfo: GraphState) {
//     this.graphInfo = graphInfo;
//     return this;
//   }

//   public setFromVertex(from: string) {
//     this.from = from;
//     return this;
//   }

//   public setToVertex(to: string) {
//     this.to = to;
//     return this;
//   }

//   public getGraphInfo() {
//     return this.graphInfo;
//   }

//   public getFromVertex() {
//     return this.from;
//   }

//   public getToVertex() {
//     return this.to;
//   }

//   public build() {
//     return new Dijkstra(this);
//   }
// }
