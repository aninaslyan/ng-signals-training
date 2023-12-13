import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { KnobModule } from 'primeng/knob';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { Subject, forkJoin, interval } from 'rxjs';
import { map, scan, startWith, switchMap, takeWhile } from 'rxjs/operators';
import { TimeInfo } from './time-info.type';
import { TimeService } from './time.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TabViewModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    KnobModule,
    PanelModule,
    DatePipe,
    MultiSelectModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // CLOCK

  // TIMER
  selectedMinutes = signal<number | null>(null);
  selectedSeconds = signal<number | null>(null);
  startTimer$ = new Subject<void>();
  paused = signal(false);
  // WORLD TIME
  private readonly timeService = inject(TimeService);
  timezones = toSignal(this.timeService.getTimeZones(), {
    initialValue: [],
  });
  locations = signal<TimeInfo[]>([
    { timezone: 'Europe/Berlin' } as TimeInfo,
    { timezone: 'Asia/Yerevan' } as TimeInfo,
    { timezone: 'Europe/Kyiv' } as TimeInfo,
  ]);

  addLocation(timezones: string[]) {
    this.locations.set(timezones.map((timezone) => ({ timezone } as TimeInfo)));
  }
}
