import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import NoDataFound from "./noDataFound";
import Loading from "./loading";

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
}

interface SortableListProps<
  T extends object,
  ExtraProps = Record<string, unknown>
> {
  items: T[];
  onItemsReorder: (newItems: T[]) => void;
  renderItem: (
    item: T,
    dndProps: DragHandleProps,
    extraProps?: ExtraProps
  ) => React.ReactNode;
  itemIdKey?: keyof T;
  containerClassName?: string;
  extraProps?: ExtraProps;
  isLoading?: boolean;
}

export function SortableList<
  T extends object,
  ExtraProps = Record<string, unknown>
>({
  items,
  onItemsReorder,
  renderItem,
  itemIdKey = "id" as keyof T,
  containerClassName,
  extraProps,
  isLoading = false,
}: SortableListProps<T, ExtraProps>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(
        (item) => (item[itemIdKey] as UniqueIdentifier) === active.id
      );
      const newIndex = items.findIndex(
        (item) => (item[itemIdKey] as UniqueIdentifier) === over?.id
      );

      const newItems = arrayMove(items, oldIndex, newIndex);

      onItemsReorder(newItems);
    }
  };

  const itemIds = items.map((item) => item[itemIdKey] as UniqueIdentifier);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        autoScroll={{ acceleration: 0 }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className={containerClassName}>
            {items.map((item) => (
              <SortableItem<T, ExtraProps>
                key={item[itemIdKey] as React.Key}
                id={item[itemIdKey] as UniqueIdentifier}
                item={item}
                renderItem={renderItem}
                extraProps={extraProps}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isLoading ? (
        <Loading
          variant="spinner"
          text="Loading data..."
          size="md"
          color="primary"
        />
      ) : !items?.length ? (
        <NoDataFound />
      ) : null}
    </>
  );
}

interface SortableItemProps<T, ExtraProps = Record<string, unknown>> {
  id: UniqueIdentifier;
  item: T;
  renderItem: (
    item: T,
    dndProps: DragHandleProps,
    extraProps?: ExtraProps
  ) => React.ReactNode;
  extraProps?: ExtraProps;
}

function SortableItem<T, ExtraProps = Record<string, unknown>>({
  id,
  item,
  renderItem,
  extraProps,
}: SortableItemProps<T, ExtraProps>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, { attributes, listeners }, extraProps)}
    </div>
  );
}
