import React from 'react';
import { DynamicConfigValue, FieldConfigOptionsRegistry, FieldOverrideContext, GrafanaTheme } from '@grafana/data';
import { FieldConfigItemHeaderTitle, selectThemeVariant, stylesFactory, useTheme } from '@grafana/ui';

import { css } from 'emotion';
interface DynamicConfigValueEditorProps {
  property: DynamicConfigValue;
  registry: FieldConfigOptionsRegistry;
  onChange: (value: DynamicConfigValue) => void;
  context: FieldOverrideContext;
  onRemove: () => void;
}

export const DynamicConfigValueEditor: React.FC<DynamicConfigValueEditorProps> = ({
  property,
  context,
  registry,
  onChange,
  onRemove,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const item = registry?.getIfExists(property.id);

  if (!item) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <FieldConfigItemHeaderTitle onRemove={onRemove} title={item.name} description={item.description} transparent>
        <div className={styles.property}>
          <item.override
            value={property.value}
            onChange={value => {
              onChange(value);
            }}
            item={item}
            context={context}
          />
        </div>
      </FieldConfigItemHeaderTitle>
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  const borderColor = selectThemeVariant(
    {
      light: theme.palette.gray85,
      dark: theme.palette.dark9,
    },
    theme.type
  );

  const highlightColor = selectThemeVariant(
    {
      light: theme.palette.blueLight,
      dark: theme.palette.blueShade,
    },
    theme.type
  );
  return {
    wrapper: css`
      border-top: 1px dashed ${borderColor};
      position: relative;
      &:hover {
        &:before {
          background: ${highlightColor};
        }
      }
      &:before {
        content: '';
        position: absolute;
        top: 0;
        z-index: 1;
        left: -1px;
        width: 2px;
        height: 100%;
        transition: background 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      }
    `,
    property: css`
      padding: ${theme.spacing.xs} ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm};
    `,
  };
});
