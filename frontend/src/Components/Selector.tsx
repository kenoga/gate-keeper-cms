import { Form } from "react-bootstrap";

interface SelectorProps {
  idAndNames: { id: number; name: string }[];
  selectedId: number;
  setId: (id: number) => void;
  label: string;
}

const Selector: React.FC<SelectorProps> = ({
  idAndNames,
  selectedId,
  setId,
  label,
}) => {
  return (
    <Form.Group controlId="exampleForm.ControlSelect1">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        onChange={(e) => {
          const id = Number(e.target.value);
          setId(id);
        }}
      >
        {idAndNames.map(({ id, name }) => {
          return (
            <option value={id} selected={id == selectedId}>
              {name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default Selector;
