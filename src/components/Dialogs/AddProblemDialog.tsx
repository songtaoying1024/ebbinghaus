import React, {ChangeEvent, Dispatch, SetStateAction, useContext, useState} from 'react';
import {DialogStateContext} from "../../providers/DialogStateProvider";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {InsertInvitation} from "@material-ui/icons";
import {Problem, ProblemsContext} from "../../providers/ProblemProvider";
import {getWeight} from "../../utils/ebbinghaus";

const AddProblemDialog = () => {
  const {addProblemDialogOpen, dispatch} = useContext(DialogStateContext);
  const {dispatch: problemDispatch} = useContext(ProblemsContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [platform, setPlatform] = useState<number>(0);
  const [serial, setSerial] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(0);
  const [time, setTime] = useState<Date | null>(null);

  const handleClose = () => {
    if (dispatch) {
      dispatch({
        type: "toggleAddProblem",
        payload: false,
      });
    }
    setPlatform(0);
    setSerial("");
    setName("");
    setDifficulty(0);
    setTime(null);
  };

  const handleChange = <T extends any>(setter: Dispatch<SetStateAction<T>>) => {
    return (event: ChangeEvent<{ value: unknown }>) => {
      setter(event.target.value as T);
    };
  };

  const handleAdd = () => {
    const currentTime = new Date().getTime();
    const createTime = time === null ? currentTime : time.getTime();

    const problem: Problem = {
      platform: platform,
      serial: serial,
      name: name,
      index: (serial + name).replace(" ", "").toLowerCase(),
      practice: 1,
      remember: 1,
      difficulty: difficulty,
      createTime: createTime,
      updateTime: createTime,
      weight: getWeight(currentTime, createTime, 1, 1),
      normCumulatedWeight: 0
    };
    if (problemDispatch) {
      problemDispatch({
        type: "addProblem",
        payload: problem
      });
    }
  }

  return (

    <Dialog
      // fullWidth
      fullScreen={fullScreen}
      open={addProblemDialogOpen}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{"Add New Problem"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justify={"center"} alignItems={"center"}>
          <Grid item xs={12} sm={6}>
            <TextField
              id={"platform"}
              fullWidth
              required
              variant={"outlined"}
              label={"Platform"}
              value={platform}
              onChange={handleChange(setPlatform)}
              select
            >
              <MenuItem value={0}>LeetCode</MenuItem>
              <MenuItem value={1}>Codility</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id={"serial"}
              fullWidth
              required
              variant={"outlined"}
              label={platform === 0 ? "Serial Number" : "Lesson Number"}
              value={serial}
              onChange={handleChange(setSerial)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id={"name"}
              fullWidth
              required
              variant={"outlined"}
              label={"Problem Name"}
              value={name}
              onChange={handleChange(setName)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {
              platform === 0 &&
              <TextField
                id={"difficulty"}
                fullWidth
                required
                variant={"outlined"}
                label={"Difficulty"}
                value={difficulty}
                onChange={handleChange(setDifficulty)}
                select
              >
                <MenuItem value={0}>Easy</MenuItem>
                <MenuItem value={1}>Medium</MenuItem>
                <MenuItem value={2}>Hard</MenuItem>
              </TextField>
            }
            {
              platform === 1 &&
              <TextField
                id={"difficulty"}
                fullWidth
                required
                variant={"outlined"}
                label={"Difficulty"}
                value={difficulty}
                onChange={handleChange(setDifficulty)}
                select
              >
                <MenuItem value={4}>Painless</MenuItem>
                <MenuItem value={5}>Respectable</MenuItem>
              </TextField>
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                autoOk
                clearable
                fullWidth
                inputVariant="outlined"
                color="secondary"
                ampm={false}
                allowKeyboardControl={false}
                margin="normal"
                id="create time"
                label="Create Time"
                value={time}
                strictCompareDates={true}
                onChange={(date) => setTime(date)}
                onError={console.log}
                format="dd.MMM.yyyy HH:mm"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <InsertInvitation/>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (serial && name) {
              handleAdd();
              handleClose();
            }
          }}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>

  );
};

export default AddProblemDialog;