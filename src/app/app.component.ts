import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {shortestPathBfs} from './algo/BFS';
import {findShortestPathDijkstra} from './algo/dijkstra';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  public result;


  villes: any = ['Londres', 'Lille', 'Bruxelle', 'Nantes', 'Paris',
    'Strasbourg', 'Lyon', 'Montpellier',
    'Marseille', 'Toulouse', 'Barcelone', 'Bordeaux'];

  algos: any = ['BFS', 'dijkstra']

  itinaryForm = this.formBuilder.group({
    depart: ['', Validators.required],
    arrive: ['', Validators.required],
    algo: ['', Validators.required]
  });

  private graph;

  // Injection de dependances
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this.graph = {
      Londres: { Paris: 136 },
      Bruxelle: { Paris: 82 },
      Lille: { Paris: 60},
      Strasbourg: { Paris: 105 },
      Paris: { Londres: 136, Lille: 60, Bruxelle: 82, Strasbourg: 105, Nantes: 132, Lyon: 120 },
      Nantes: { Paris: 132, Bordeaux: 109 },
      Bordeaux: { Nantes: 109, Toulouse: 55 },
      Lyon: { Paris: 120, Montpellier: 54, Marseille: 86 },
      Montpellier: { Lyon: 54, Toulouse: 45 },
      Marseille: { Lyon: 86 },
      Barcelone: { Toulouse: 174 },
      Toulouse: { Barcelone: 174, Montpellier: 45, Bordeaux: 109 },
    };
  }

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



}
