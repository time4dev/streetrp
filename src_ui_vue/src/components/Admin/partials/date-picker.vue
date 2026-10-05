<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
	import { useField, useForm } from 'vee-validate';
	import dayjs from '@/utils/dayjs';

	// Port of the legacy react-datepicker wrapper (partials/date-picker.tsx):
	// same DOM classes (react-datepicker + admin_datepicker calendar) and the
	// same date -> ISO conversion as getCorrectDate().
	const props = defineProps<{
		placeholder: string;
		name: string;
	}>();

	const { value } = useField<string>(props.name);
	const { setFieldValue } = useForm();

	const menuOpen = ref(false);
	const root = ref<HTMLElement>();
	const viewMonth = ref(dayjs());
	const timeFilter = ref('');

	const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

	const displayValue = computed(() =>
		value.value ? dayjs(value.value).format('DD.MM.YYYY, HH:mm') : ''
	);

	function getCorrectDate(picked: Date) {
		const momentDate = dayjs(picked);
		const timezoneOffset = picked.getTimezoneOffset();

		return momentDate
			.subtract(momentDate.utcOffset() + timezoneOffset, 'minutes')
			.toISOString();
	}

	const selectedDate = computed(() => (value.value ? dayjs(value.value) : null));

	const monthLabel = computed(() => viewMonth.value.format('MMMM YYYY'));

	// weeks grid (monday-first, like the ru locale of react-datepicker)
	const weeks = computed(() => {
		const firstDay = viewMonth.value.startOf('month');
		const offset = (firstDay.day() + 6) % 7;
		const gridStart = firstDay.subtract(offset, 'day');

		const result: dayjs.Dayjs[][] = [];
		let cursor = gridStart;

		for (let week = 0; week < 6; week++) {
			const days: dayjs.Dayjs[] = [];

			for (let day = 0; day < 7; day++) {
				days.push(cursor);
				cursor = cursor.add(1, 'day');
			}

			result.push(days);
		}

		return result;
	});

	// time list: 5 minute intervals (legacy timeIntervals={5})
	const timeItems = computed(() => {
		const items: string[] = [];

		for (let hours = 0; hours < 24; hours++) {
			for (let minutes = 0; minutes < 60; minutes += 5) {
				items.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
			}
		}

		return timeFilter.value
			? items.filter((item) => item.includes(timeFilter.value))
			: items;
	});

	function previousMonth() {
		viewMonth.value = viewMonth.value.subtract(1, 'month');
	}

	function nextMonth() {
		viewMonth.value = viewMonth.value.add(1, 'month');
	}

	function pickDay(day: dayjs.Dayjs) {
		if (day.month() !== viewMonth.value.month()) return;

		const time = selectedDate.value
			? dayjs(value.value).format('HH:mm')
			: '00:00';

		const [hours, minutes] = time.split(':').map(Number);
		const picked = day.hour(hours).minute(minutes).second(0).toDate();

		setFieldValue(props.name, getCorrectDate(picked));
	}

	function pickTime(time: string) {
		const [hours, minutes] = time.split(':').map(Number);

		const base = selectedDate.value ?? viewMonth.value.hour(hours).minute(minutes);
		const picked = base.hour(hours).minute(minutes).second(0).toDate();

		setFieldValue(props.name, getCorrectDate(picked));

		menuOpen.value = false;
	}

	function onDocumentMouseDown(event: MouseEvent) {
		if (root.value && !root.value.contains(event.target as Node)) {
			menuOpen.value = false;
		}
	}

	function onInputClick() {
		if (!menuOpen.value) {
			menuOpen.value = true;

			if (selectedDate.value) viewMonth.value = selectedDate.value;
		}
	}

	onMounted(() => {
		document.addEventListener('mousedown', onDocumentMouseDown);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', onDocumentMouseDown);
	});
</script>

<template>
	<div ref="root" class="react-datepicker-wrapper admin-datepicker-root">
		<input
			type="text"
			class="admin_field react-datepicker-ignore-onclickoutside"
			:name="name"
			:value="displayValue"
			:placeholder="placeholder"
			readonly
			@click="onInputClick"
		/>

		<div v-if="menuOpen" class="react-datepicker-popper" data-placement="bottom">
			<div class="react-datepicker admin_datepicker">
				<button
					type="button"
					class="react-datepicker__navigation react-datepicker__navigation--previous"
					@click="previousMonth"
				></button>

				<button
					type="button"
					class="react-datepicker__navigation react-datepicker__navigation--next"
					@click="nextMonth"
				></button>

				<div class="react-datepicker__month-container">
					<div class="react-datepicker__header">
						<button type="button" class="react-datepicker__current-month">
							{{ monthLabel }}
						</button>

						<div class="react-datepicker__day-names">
							<div
								v-for="day in WEEK_DAYS"
								:key="day"
								class="react-datepicker__day-name"
							>
								{{ day }}
							</div>
						</div>
					</div>

					<div class="react-datepicker__month">
						<div
							v-for="(week, weekIndex) in weeks"
							:key="weekIndex"
							class="react-datepicker__week"
						>
							<div
								v-for="day in week"
								:key="day.valueOf()"
								:class="[
									'react-datepicker__day',
									{
										'react-datepicker__day--outside-month':
											day.month() !== viewMonth.month(),
										'react-datepicker__day--selected':
											!!selectedDate && day.isSame(selectedDate, 'day'),
										'react-datepicker__day--today': day.isSame(dayjs(), 'day')
									}
								]"
								@click="pickDay(day)"
							>
								{{ day.date() }}
							</div>
						</div>
					</div>
				</div>

				<div class="react-datepicker__time-container">
					<div class="react-datepicker__header">
						<div class="react-datepicker__time">Время</div>
					</div>

					<ul class="react-datepicker__time-list">
						<li
							v-for="time in timeItems"
							:key="time"
							:class="[
								'react-datepicker__time-list-item',
								{
									'react-datepicker__time-list-item--selected':
										!!selectedDate && selectedDate.format('HH:mm') === time
								}
							]"
							@click="pickTime(time)"
						>
							{{ time }}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
	.admin-datepicker-root {
		position: relative;
		display: block;
	}

	.admin-datepicker-root .react-datepicker-popper {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 2;
	}
</style>
