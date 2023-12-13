import { DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { KnobModule } from 'primeng/knob';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { Subject, forkJoin, interval, map } from 'rxjs';
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
        JsonPipe,
        NgForOf,
    ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // CLOCK
  interval$ = interval(1);
  time = toSignal(this.interval$.pipe(map(() => new Date())), {initialValue: new Date()});

  hours = computed(() => this.time().getHours().toString().padStart(2, '0'));
  minutes = computed(() => this.time().getMinutes().toString().padStart(2, '0'));
  seconds = computed(() => this.time().getSeconds().toString().padStart(2, '0'));

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
    locationsToPrint = computed(() => {
        return this.locations().map(location => location.timezone)
    });
  response = signal<TimeInfo[]>([]);
  locationChange = computed(() => {
      const requests = this.locations().map(name => this.timeService.getTimeByTimezone(name.timezone));
      forkJoin([...requests]).subscribe((resp) => {
          this.response.set(resp);
      });
  });

  addLocation(timezones: string[]) {
    this.locations.set(timezones.map((timezone) => ({ timezone } as TimeInfo)));
  }
}
