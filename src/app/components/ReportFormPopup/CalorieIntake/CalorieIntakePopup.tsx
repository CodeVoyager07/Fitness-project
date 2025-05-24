import React, { useEffect, useRef, useState } from 'react';
import '../popup.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface CalorieIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CalorieIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e';
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    flatpickr(dateInputRef.current!, {
      dateFormat: 'F j, Y',
      onChange: (selectedDates) => {
        setSelectedDate(selectedDates[0]);
        console.log('Selected Date:', selectedDates[0]);
      },
    });
  }, []);

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false);
          }}
        >
          <AiOutlineClose />
        </button>

        {/* Flatpickr input field */}
        <input
          type="text"
          ref={dateInputRef}
          style={{ borderColor: color, padding: '10px', width: '100%', marginBottom: '20px' }}
        />

        <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning" />
        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" color="warning" />

        <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock value={value} onChange={(newValue) => setValue(newValue)} />
          </LocalizationProvider>
        </div>

        <Button variant="contained" color="warning">
          Save
        </Button>
        <div className='hrline'></div>

        {/* Food items list */}
        <div className='items'>
          <div className='item'>
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button><AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button><AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button><AiFillDelete /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieIntakePopup;
