import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/entities/services/data.service';
import { IUser } from 'src/app/entities/interfaces/user.interface';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    user: IUser = {
        id: 0,
        name: '',
        strength: 0,
        abilities: [],
        level: 0
    };

    confirmPopupVisible: boolean = false;
    deletePopupVisible: boolean = false;
    popupVisible: boolean = false;
    secondpopupVisible: boolean = false;
    thirdpopupVisible: boolean = false;
    deletedUserId: number | null = null; 
    deletedUserName: string | null = null; 
    addedUserName: string | null = null; 
    addedAbility: string | null = null; 
    allUsers: IUser[] = [];
    newAbility: string = '';
    availableAbilities: string[] = [];
    users: IUser[] = [];
    searchTerm: string = '';
    expandedUserId: number | null = null;
    minLevel: number | null = null;
    maxLevel: number | null = null;
    selectedAbilities: string[] = [];
    expandedUserIds: number[] = [];
    selectedSort: string = 'Ascending'; 
    sortOptions: string[] = ['По возрастанию', 'По убыванию'];

    constructor(private dataService: DataService) {}

    /**
     * Выполняет инициализацию компонента.
     * Загружает доступные способности и пользователей.
     * @returns {void}
     */
    ngOnInit(): void {
        this.loadAvailableAbilities();
        this.loadUsers();
    }

    /**
    * Выполняет загрузку доступных способностей из сервиса данных и присваивает их свойству availableAbilities.
    * @returns {void}
    */
    loadAvailableAbilities(): void {
        this.dataService.getAbilities().subscribe(abilities => {
            this.availableAbilities = abilities;
        });
    }

    /**
    * Выполняет загрузку пользователей из сервиса данных и присваивает полученный список свойству allUsers.
    * Затем применяет фильтры к списку пользователей.
    * @returns {void}
    */
    loadUsers() {
        this.dataService.getUsers().subscribe(users => {
            this.allUsers = users;
            this.users = users;
            this.applyFilters();
        });
    }

    /**
     * Применяет сортировку к списку пользователей в соответствии с выбранным порядком сортировки.
     * Если выбран порядок сортировки "По возрастанию", сортирует пользователей по возрастанию уровня.
     * Если выбран порядок сортировки "По убыванию", сортирует пользователей по убыванию уровня.
     * @returns {void}
     */
    applySort() {
        if (this.selectedSort === 'По возрастанию') {
            this.users.sort((a, b) => a.level - b.level);
        } else if (this.selectedSort === 'По убыванию') {
            this.users.sort((a, b) => b.level - a.level);
        }
    }

    /**
    * Применяет фильтры к списку пользователей.
    * @returns {void}
    */
    applyFilters() {
        
        this.applySearchFilter();
        this.applyLevelFilter();
        this.applyAbilityFilter();
        console.log('Selected abilities:', this.selectedAbilities);
        this.applySort();
    }

    /**
     * Применяет фильтр поиска к списку пользователей.
     * @returns {void}
     */
    applySearchFilter() {
        if (!this.searchTerm.trim()) {
            this.users = this.allUsers;
        } else {
            this.users = this.allUsers.filter(user => user.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
        }
    }

    /**
     * Применяет фильтр по уровню к списку пользователей.
     * @returns {void}
     */
    applyLevelFilter() {
        if (this.minLevel != null && this.maxLevel != null) {
            this.users = this.users.filter(user => {
                return user.level != null && this.minLevel != null && this.maxLevel != null && user.level >= this.minLevel && user.level <= this.maxLevel;
            });
        }
    }

    /**
     * Применяет фильтр по способностям к списку пользователей.
     * @returns {void}
     */
    applyAbilityFilter() {
        console.log('Selected abilities in applyAbilityFilter:', this.selectedAbilities);
      if (this.selectedAbilities.length > 0) {
          this.users = this.users.filter(user => {
              return this.selectedAbilities.every(ability => user.abilities.includes(ability));
          });
      }
    }

  
    /**
     * Вызывается при отправке формы для добавления нового пользователя.
     * Устанавливает имя добавленного пользователя, проверяет валидность формы.
     * Если форма валидна, отправляет данные на сервер для добавления нового пользователя.
     * При успешном добавлении пользователя сбрасывает поля формы, загружает список пользователей и отображает всплывающее окно.
     * @returns {void}
     */
    onSubmit() {
        this.addedUserName = this.user.name;
        if (!this.isFormValid()) {
            return;
        }
        this.dataService.addUser(this.user).subscribe(() => {
            this.user = {
                id: 0,
                name: '',
                strength: 0,
                abilities: [],
                level: 0
            };
            this.loadUsers(); 
            this.thirdpopupVisible = true;
        }, error => {
            console.error('Error adding user:', error);
        });
    }

    /**
     * Выполняет добавление новой способности.
     * Проверяет валидность введённой способности перед добавлением.
     * @returns {void}
     */
    addAbility() {
        const abilityPattern = /^[A-Za-zА-Яа-яЁё\s]+$/; 
        this.addedAbility = this.newAbility;
        if (this.newAbility && abilityPattern.test(this.newAbility.trim())) {
            if (!this.availableAbilities.includes(this.newAbility.trim())) {
                this.dataService.addAbility(this.newAbility.trim());
                this.secondpopupVisible = true;
            }
            this.newAbility = '';
        }
    }

    /**
     * Выполняет удаление пользователя.
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
            // this.popupVisible = true;
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
     * Открывает окно подтверждения удаления пользователя.
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

    /**
     * Проверяет валидность введённой способности.
     * @returns {boolean} -true, если способность введена корректно и её ещё нет в списке доступных способностей, в противном случае - false.
     */
    isAbilityValid(): boolean {
        const abilityPattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
        return !!this.newAbility && abilityPattern.test(this.newAbility.trim()) && !this.availableAbilities.includes(this.newAbility.trim());
    }
    
    /**
     * Проверяет валидность данных формы добавления пользователя.
     * @returns {boolean} - true, если все данные формы корректны, в противном случае - false.
     */
    isFormValid(): boolean {
      const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/; 
      return namePattern.test(this.user.name.trim()) && 
          this.user.strength >= 0 && this.user.strength <= 100 &&
          this.user.level >= 0 && this.user.level <= 100 &&
          this.user.abilities.length > 0;
    }
    // toggleAccordion(userId: number): void {
    //     this.expandedUserId = this.expandedUserId === userId ? null : userId;
    // }

    // isAccordionExpanded(userId: number): boolean {
    //     return this.expandedUserId === userId;
    // }

    /**
     * Переключает состояние аккордеона для указанного пользователя.
     * @param {number} userId - Идентификатор пользователя.
     * @returns {void}
     */
    toggleAccordion(userId: number): void {
        const index = this.expandedUserIds.indexOf(userId);
        if (index !== -1) {
          this.expandedUserIds.splice(index, 1); // Закрываем контейнер, если уже открыт
        } else {
          this.expandedUserIds.push(userId); // Открываем контейнер
        }
    }

    /**
     * Проверяет, раскрыт ли аккордеон для указанного пользователя.
     * @param {number} userId - Идентификатор пользователя.
     * @returns {boolean} - true, если контейнер аккордеона для указанного пользователя открыт, в противном случае - false.
     */
    isAccordionExpanded(userId: number): boolean {
        return this.expandedUserIds.includes(userId); // Проверяем, открыт ли контейнер
    }
}