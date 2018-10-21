import * as React from "react";
import { createStyles, withStyles, WithStyles } from "../../lib/material-ui";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { List as VirtualizedList } from "react-virtualized/dist/es/List";

const styles = theme =>
  createStyles({
    checkboxRoot: {
      padding: 0
    },
    list: {
      overflowY: "hidden",
      paddingTop: 0,
      paddingBottom: 0
    },
    listItem: {
      paddingLeft: theme.spacing.unit * 1.5
    }
  });

interface Props<T> extends WithStyles<typeof styles> {
  items: T[];
  width: number;
  height: number;
  primaryRenderer: (item: T) => string;
  secondaryRenderer: (item: T) => JSX.Element;
  onItemSelected?: (selectedItems: model.IValidatorSelection) => void;
}

const SelectableList: React.SFC<Props<model.IValidatorSelection>> = ({
  classes,
  items,
  primaryRenderer,
  secondaryRenderer,
  onItemSelected,
  width,
  height
}) => (
  <List dense className={classes.list}>
    <VirtualizedList
      width={width}
      autoWidth
      autoContainerWidth
      height={height}
      rowHeight={50}
      rowRenderer={({ index, key, style }) => (
        <ListItem
          key={key}
          className={classes.listItem}
          style={style}
          dense
          button
          disableGutters
          disableRipple
          onClick={e =>
            onItemSelected ? onItemSelected(items[index]) : undefined
          }
        >
          {onItemSelected && (
            <Checkbox
              checked={!!items[index].isSelected}
              classes={{ root: classes.checkboxRoot }}
              tabIndex={-1}
              disableRipple
            />
          )}
          <ListItemText
            primary={primaryRenderer(items[index])}
            secondary={secondaryRenderer(items[index])}
          />
        </ListItem>
      )}
      rowCount={items.length}
    />
  </List>
);

export default withStyles(styles)(SelectableList);
