// data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private users: IUser[] = [
    { id: 1, name: 'Артём', strength: 80, abilities: ['Скорость', 'Телепортация'], level: 5 },
    { id: 2, name: 'Данил', strength: 70, abilities: ['Телепортация'], level: 6 },
    { id: 3, name: 'Максим', strength: 60, abilities: ['Невидимость'], level: 7 },
    { id: 4, name: 'Железный человек', strength: 50, abilities: ['Невидимость'], level: 8 },
    { id: 5, name: 'Человек-паук', strength: 40, abilities: ['Невидимость'], level: 9 },
    { id: 6, name: 'Халк', strength: 30, abilities: ['Невидимость'], level: 10 },
    { id: 7, name: 'Тор', strength: 20, abilities: ['Невидимость'], level: 11 },
    { id: 8, name: 'Бэтмен', strength: 10, abilities: ['Невидимость'], level: 12 },
    { id: 9, name: 'Танос', strength: 35, abilities: ['Невидимость'], level: 13 },
    { id: 10, name: 'Доктор Стрендж', strength: 100, abilities: ['Невидимость'], level: 14 },
    { id: 11, name: 'Человек-муравей', strength: 110, abilities: ['Невидимость'], level: 15 },
    { id: 12, name: 'Соколиный глаз', strength: 120, abilities: ['Невидимость'], level: 16 },

    // Добавьте других пользователей по мере необходимости
  ];
  private abilities: string[] = [ 'Суперсила', 'Левитация', 'Телепортация', 'Невидимость', 'Скорость', ];


  constructor() { }

  getUsers(): Observable<IUser[]> {
    return of(this.users);
  }

  addUser(user: IUser): Observable<void> {
    const newUser = { ...user, id: this.getNextUserId() };
    this.users.push(newUser);
    return of(undefined);
  }

  addAbility(ability: string): void {
    if (!this.abilities.includes(ability)) { 
        this.abilities.push(ability);
        console.log('Ability added:', ability);
    } else {
        console.log('Ability already exists:', ability);
    }
    console.log('Abilities after adding:', this.abilities);
}



  getAbilities(): Observable<string[]> {
    return of(this.abilities);
  }

  deleteUser(userId: number): Observable<void> {
    this.users = this.users.filter(user => user.id !== userId);
    return of(undefined); // исправлено
  }

  private getNextUserId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(user => user.id)) + 1 : 1;
  }
}
