# TP programmation fonctionnelle

## Projet Path Finding sur réseau ferroviaire

Pour illustrer les concepts vu en cours de programmation fonctionnelle je vais utiliser une application que j'ai réalisé. Dans cette application j'ai implémenté un réseau de 12 noeuds représentant plusieurs gares ferroviaires de France. Ce réseau est représenté par un graphe non orienté et valué, les valeurs des branches correspondent au temps de trajet en minutes entre deux points(ce temps est converti en heures dans l'affichage front).</br>
Le but de l'application est de sélectionner un point de départ, puis un point d'arrivé ainsi que l'algorithme désiré pour le calcul.</br>
Le résultat obtenu contient l'itinéraire, le temps en heure du trajet, ainsi que le temps d'exécution de l'algorithme en millisecondes.

## Utilisation d'expression Lambda et d'une fonction Pure

Dans mon algorithme j'utilise les expressions lambdas en TypeScript  pour contenir mes algorithmes de pathfinding :

```agsl
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
```

``localisation du fichier : src/app/algo/dijkstra.ts``

Cette fonction lambda prend en paramètre 3 objets, un graph qui correspond au trajet, et 2 objets de type "Node" qui corresponde 
au point de départ et au point d'arrivé. On remarque qu'il s'agit aussi d'une fonction dite "Pure" car elle  ne dépend que des ses paramètres d'entrées et 
et elle s'occupe uniquement de renvoyer une valeur qui correspond au chemin le plus court trouvé par l'algorithme de Dijkstra.

## Exemple d'une fonction Immutable

```agsl
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
```
``localisation du fichier : src/app/algo/dijkstra.ts``

Ici nous avons une fonction qui sert a calculer la plus courte distance entre 2 nodes, l'on peut voir qu'il sagit d'une 
fonction Immutable car nous ne modifions les nodes en paramètres et nous retournons une nouvelle variable shortest à chaque
execution de la fonction.

## Exemple d'une fonction Idempotente

```agsl
  onSubmit(): void {
      if (this.itinaryForm.valid) {
        let depart = this.itinaryForm.value.depart;
        let arrive = this.itinaryForm.value.arrive;
        if (this.itinaryForm.value.algo == 'BFS') {
          this.result = shortestPathBfs(this.graph, depart, arrive);
  
        } else {
          this.result = findShortestPathDijkstra(this.graph, depart, arrive);
        }
      }
    }
```

``localisation du fichier : src/app/app.component.ts``

Dans cette fonction l'on attend des entrées utilisateur pour réaliser le calcul puis l'on stock le résultat dans une 
variable "result". Cette fonction est idempotente car l'on écrase à chaque execution le résultat dans la variable globale "result".
Notre seul effet de bord est donc la réaffectation de la variable "result".

## Partager un comportement entre plusieurs classes sans héritage

Pour le cas de ce programme j'utilise le framework Angular, Angular intègre un mechanisme d'injection de dependances.

```agsl
itinaryForm = this.formBuilder.group({
    depart: ['', Validators.required],
    arrive: ['', Validators.required],
    algo: ['', Validators.required]
  });

  private graph;

  // Injection de dependances 
  constructor(private formBuilder: FormBuilder) {}
```
``localisation du fichier : src/app/app.component.ts``

Dans l'exemple ci-dessus j'utilise les méthodes de la classe FormBuilder depuis ma classe mère AppComponent.

