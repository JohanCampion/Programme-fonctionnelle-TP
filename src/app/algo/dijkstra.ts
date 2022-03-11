const shortestDistanceNode = (distances, visited) => {
  let shortest = null;

  for (let node in distances) {
    let currentIsShortest =
      shortest === null || distances[node] < distances[shortest];
    if (currentIsShortest && !visited.includes(node)) {
      shortest = node;
    }
  }
  return shortest;
};

export const findShortestPathDijkstra = (graph, startNode, endNode) => {
  // objets pour stocker la distance depuis le start
  let distances = {};
  distances[endNode] = "Infinity";
  distances = Object.assign(distances, graph[startNode]);
  // temps d'éxécution
  const start = performance.now();

  // recuperer le path
  let parents = { endNode: null };
  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }
  let visited = [];

  let node = shortestDistanceNode(distances, visited);

  while (node) {
    // get distance
    let distance = distances[node];
    let children = graph[node];
    for (let child in children) {
      if (String(child) === String(startNode)) {
        continue;
      } else {
        let newdistance = distance + children[child];
        if (!distances[child] || distances[child] > newdistance) {
          distances[child] = newdistance;
          parents[child] = node;
        }
      }
    }
    visited.push(node);
    node = shortestDistanceNode(distances, visited);
  }

  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  // on retourne le plus court chemin depuis le départ jusqu'à l'arrivé
  let results = {
    distance: distances[endNode],
    path: shortestPath,
    execution: performance.now() - start
  };

  return results;
};
