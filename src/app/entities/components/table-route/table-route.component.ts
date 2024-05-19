import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/entities/services/data.service';
import { DxPopupComponent } from 'devextreme-angular';



@Component({
  selector: 'app-table-route',
  templateUrl: './table-route.component.html',
  styleUrls: ['./table-route.component.scss']
})

export class TableRouteComponent implements OnInit {
  confirmPopupVisible: boolean = false;
  deletePopupVisible: boolean = false;
  popupVisible: boolean = false;
  deletedUserId: number | null = null; // Устанавливаем тип и начальное значение для идентификатора удаленного пользователя
  deletedUserName: string | null = null; // Устанавливаем тип и начальное значение для имени удаленного пользователя
  users: any[] = [];

  constructor(private dataService: DataService) {}
  @ViewChild(DxPopupComponent, { static: false }) popup!: DxPopupComponent;
  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Загружает список пользователей из сервиса данных и присваивает его свойству users.
   * @returns {void}
   */
  loadUsers() {
    this.dataService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }

  /**
   * Удаляет пользователя по указанному идентификатору.
   * После удаления пользователя загружает список пользователей и отображает уведомление о удалении.
   * @param {number} userId - Идентификатор пользователя для удаления.
   * @returns {void}
   */
  deleteUser(userId: number): void {
    this.deletedUserName = this.getUserNameById(userId);
    this.dataService.deleteUser(userId).subscribe(
      () => {
        console.log('User deleted successfully');
        this.loadUsers();
        // this.deletedUserId = userId; 
        // this.popupVisible = true; // Отображаем всплывающее окно после успешного удаления
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }

  /**
   * Возвращает имя пользователя по его идентификатору.
   * Если пользователь не найден, возвращает 'Неизвестный пользователь'.
   * @param {number} userId - Идентификатор пользователя.
   * @returns {string} - Имя пользователя или 'Неизвестный пользователь'.
   */
  getUserNameById(userId: number): string {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      console.log('Найден пользователь:', user);
      return user.name;
    } else {
      console.log('Пользователь не найден');
      return 'Неизвестный пользователь';
    }
  }

  /**
   * Открывает всплывающее окно подтверждения удаления пользователя.
   * Устанавливает идентификатор и имя пользователя для последующего удаления.
   * @param {number} userId - Идентификатор пользователя для удаления.
   * @param {string} userName - Имя пользователя для отображения в окне подтверждения.
   * @returns {void}
   */
  openConfirmPopup(userId: number, userName: string) {
    this.deletedUserId = userId;
    this.deletedUserName = userName;
    this.confirmPopupVisible = true;
  }

  /**
   * Подтверждает удаление пользователя после закрытия окна подтверждения.
   * Закрывает окно подтверждения и открывает окно уведомления о удалении.
   * @param {number} userId - Идентификатор пользователя для удаления.
   * @returns {void}
   */
  confirmDelete(userId: number) {
    this.confirmPopupVisible = false;
    this.deleteUser(userId);
    this.deletePopupVisible = true;
  }
}