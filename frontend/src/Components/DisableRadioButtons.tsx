import { Form } from "react-bootstrap";
import { TimeRange } from "../api";

type Id = string;
export type IdAndValue<T> = {
  id: T;
  value: string;
};

type SelectedId = string;

type RadioButtonsValues<T> = IdAndValue<T>[];

function RadioButton<T>(
  idAndValue: IdAndValue<T>,
  isDisable: (id: T) => boolean,
  selectedId: T | null
): JSX.Element {
  return (
    <Form.Check
      type="radio"
      name={idAndValue.value}
      className="radioButton custom-control custom-radio"
      id={idAndValue.id as any}
    >
      <Form.Check.Input
        type="radio"
        checked={selectedId == idAndValue.id}
        value={idAndValue.id as any}
        disabled={isDisable(idAndValue.id)}
      ></Form.Check.Input>
      <Form.Check.Label>{idAndValue.value}</Form.Check.Label>
    </Form.Check>
  );
}

interface Props<T> {
  values: RadioButtonsValues<T>;
  isDisable: (id: T) => boolean;
  selectedId: T | null;
  setSelectedId: (id: T) => void;
}

const DisableRadioButtons: React.FC<Props<TimeRange>> = ({
  values,
  isDisable,
  selectedId,
  setSelectedId,
}) => {
  return (
    <div
      onChange={(e: any) => {
        setSelectedId(e.target.value);
      }}
      className="radioButtons text-center"
    >
      {Array.from(
        values.map((idAndValue) => {
          return RadioButton(idAndValue, isDisable, selectedId);
        })
      )}
    </div>
  );
};

export default DisableRadioButtons;
