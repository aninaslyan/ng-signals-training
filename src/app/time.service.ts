import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeInfo } from './time-info.type';

@Injectable({ providedIn: 'root' })
export class TimeService {
  private readonly http = inject(HttpClient);
  getTimeZones(): Observable<string[]> {
    return this.http.get<string[]>('http://worldtimeapi.org/api/timezone');
  }

  getTimeByTimezone(timezone: string): Observable<TimeInfo> {
    return this.http.get<TimeInfo>(
      `http://worldtimeapi.org/api/timezone/${timezone}`,
    );
  }
}
