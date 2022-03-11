export const shortestPathBfs = (graph, startNode, stopNode) => {
  let prev = {[startNode]: null}
  const queue = [startNode];
  let path = [];
  let distance = 0;

  // temps d'éxécution
  const start = performance.now();

  while (queue.length > 0) {
    let currentNode = queue.shift();
    if (currentNode === stopNode) {
      while(currentNode) {

        // récupération de la distance et du path
        if (!!prev[currentNode]) {
          distance = distance + graph[currentNode][prev[currentNode]];
        }
        path.unshift(currentNode);
        currentNode = prev[currentNode];
      }
      return {
        distance: distance,
        path: path,
        execution: performance.now() - start
      }
    };

    for (let neighbour of Object.keys(graph[currentNode])) {
      if (!(neighbour in prev)) {
        prev[neighbour] = currentNode;
        queue.push(neighbour);
      }
    }
  }
  return {
    distance: distance,
    path: path
  };
};
