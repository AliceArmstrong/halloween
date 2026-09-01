import { UI_VARIANTS } from "../config/uiVariants";

export default function InterfaceSwitcher({ selectedVariant, onChange }) {
  return (
    <div className="interface-switcher" role="group" aria-label="Interface style">
      <label htmlFor="ui-variant">UI style</label>
      <select
        id="ui-variant"
        value={selectedVariant}
        onChange={(event) => onChange(event.target.value)}
      >
        {UI_VARIANTS.map((variant) => (
          <option key={variant.key} value={variant.key}>
            {variant.label}
          </option>
        ))}
      </select>
    </div>
  );
}
