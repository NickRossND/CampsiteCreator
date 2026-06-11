import { useRef, useEffect } from 'react';
import { Rect, Text, Group, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { PlacedItem } from '../../types/campsite';
import { definitionMap } from '../../data/itemDefinitions';
import { useCampsiteStore } from '../../store/campsiteStore';

interface CampsiteItemProps {
  item: PlacedItem;
  pxPerFoot: number;
  isSelected: boolean;
}

const SNAP = 0.5; // feet

function snapToGrid(val: number): number {
  return Math.round(val / SNAP) * SNAP;
}

export function CampsiteItem({ item, pxPerFoot, isSelected }: CampsiteItemProps) {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const { updateItem, selectItem, plotWidth, plotDepth, snapToGrid: snap } = useCampsiteStore();
  const def = definitionMap.get(item.definitionId);

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!def) return null;

  const px = item.x * pxPerFoot;
  const py = item.y * pxPerFoot;
  const pw = item.width * pxPerFoot;
  const pd = item.depth * pxPerFoot;

  const label = item.label || def.name;
  const fontSize = Math.max(8, Math.min(14, pw / label.length * 1.1, pd / 2));

  return (
    <>
      <Group
        ref={groupRef}
        x={px}
        y={py}
        width={pw}
        height={pd}
        rotation={item.rotation}
        draggable
        onClick={() => selectItem(item.instanceId)}
        onTap={() => selectItem(item.instanceId)}
        onDragEnd={(e) => {
          const node = e.target;
          let newX = node.x() / pxPerFoot;
          let newY = node.y() / pxPerFoot;
          if (snap) {
            newX = snapToGrid(newX);
            newY = snapToGrid(newY);
          }
          // Clamp within plot bounds (approximate, ignores rotation)
          newX = Math.max(item.width / 2, Math.min(plotWidth - item.width / 2, newX));
          newY = Math.max(item.depth / 2, Math.min(plotDepth - item.depth / 2, newY));
          updateItem(item.instanceId, { x: newX, y: newY });
          node.x(newX * pxPerFoot);
          node.y(newY * pxPerFoot);
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const newWidth = Math.max(1, (pw * scaleX) / pxPerFoot);
          const newDepth = Math.max(1, (pd * scaleY) / pxPerFoot);
          const newX = node.x() / pxPerFoot;
          const newY = node.y() / pxPerFoot;
          node.scaleX(1);
          node.scaleY(1);
          updateItem(item.instanceId, {
            width: newWidth,
            depth: newDepth,
            x: newX,
            y: newY,
            rotation: node.rotation(),
          });
        }}
      >
        <Rect
          x={-pw / 2}
          y={-pd / 2}
          width={pw}
          height={pd}
          fill={def.color}
          opacity={0.82}
          stroke={isSelected ? '#f59e0b' : '#fff'}
          strokeWidth={isSelected ? 2.5 : 1}
          cornerRadius={3}
        />
        <Text
          x={-pw / 2 + 2}
          y={-pd / 2 + 2}
          width={pw - 4}
          height={pd - 4}
          text={label}
          fontSize={fontSize}
          fill="#fff"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          listening={false}
          wrap="word"
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}
