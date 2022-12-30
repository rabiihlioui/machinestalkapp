import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map, startWith, catchError, of, BehaviorSubject } from 'rxjs';
import { ApiResponse } from './interface/api-response';
import { Page } from './interface/page';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  userState$: Observable<{appState: string, appData?: ApiResponse<Page>, error?: HttpErrorResponse}>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(null);
  currentPage$ = this.currentPageSubject.asObservable();

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userState$ = this.userService.users$().pipe(
      map((response: ApiResponse<Page>) => {
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.data.page.number)
        console.log(response);
        return ({appState: 'APP_LOADED', appData: response});
      }),
    startWith({appState: 'APP_LOADING'}),
    catchError((error: HttpErrorResponse) => of({appState: 'APP_ERROR', error}))
    )}

    goToPage(gender?: string, pageNumber: number = 0): void {
      this.userState$ = this.userService.users$(gender, pageNumber).pipe(
        map((response: ApiResponse<Page>) => {
          this.responseSubject.next(response);
          this.currentPageSubject.next(pageNumber)
          console.log(response);
          return ({appState: 'APP_LOADED', appData: response});
        }),
      startWith({appState: 'APP_LOADED', appData: this.responseSubject.value}),
      catchError((error: HttpErrorResponse) => of({appState: 'APP_ERROR', error}))
      )}

    goToNextOrPrevious(direction?: string, gender?: string): void {
      this.goToPage(gender, direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
    }
}
