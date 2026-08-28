export default function DummyInput({ value }: { value: string | number }) {
    return (
        <input
            type="text"
            onChange={() => {}}
            value={value}
            hidden={true}
            required={true}
            name="dummy"
        />
    );
}
