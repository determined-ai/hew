import { getMiddleCenterBias, measureTextCached, type Theme } from '@glideapps/glide-data-grid';

import { hsl2str, str2hsl } from 'kit/internal/functions';

interface CornerRadius {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | CornerRadius,
): void {
  if (radius === 0) {
    ctx.rect(x, y, width, height);
    return;
  }
  if (typeof radius === 'number') {
    radius = { bl: radius, br: radius, tl: radius, tr: radius };
  }

  // restrict radius to a reasonable max
  radius = {
    bl: Math.min(radius.bl, height / 2, width / 2),
    br: Math.min(radius.br, height / 2, width / 2),
    tl: Math.min(radius.tl, height / 2, width / 2),
    tr: Math.min(radius.tr, height / 2, width / 2),
  };

  ctx.moveTo(x + radius.tl, y);
  ctx.arcTo(x + width, y, x + width, y + radius.tr, radius.tr);
  ctx.arcTo(x + width, y + height, x + width - radius.br, y + height, radius.br);
  ctx.arcTo(x, y + height, x, y + height - radius.bl, radius.bl);
  ctx.arcTo(x, y, x + radius.tl, y, radius.tl);
}

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  direction: 'down' | 'up' = 'up',
  x: number,
  y: number,
  width = 8,
  height = 12,
): void {
  const headDelta = width / 2;

  ctx.beginPath();

  switch (direction) {
    case 'up':
      ctx.moveTo(x, y + headDelta);
      ctx.lineTo(x + headDelta, y);
      ctx.lineTo(x + width, y + headDelta);
      ctx.moveTo(x + headDelta, y);
      ctx.lineTo(x + headDelta, y + height);
      break;
    case 'down':
      ctx.moveTo(x, y + height - headDelta);
      ctx.lineTo(x + headDelta, y + height);
      ctx.lineTo(x + width, y + height - headDelta);
      ctx.moveTo(x + headDelta, y);
      ctx.lineTo(x + headDelta, y + height);
      break;
  }

  ctx.closePath();
  ctx.stroke();
}

function truncate(
  ctx: CanvasRenderingContext2D,
  text: string,
  _x: number,
  maxWidth: number,
  suffix = '…',
): string {
  const ellipsisWidth = ctx.measureText(suffix).width;
  let newText = text;
  let textWidth = ctx.measureText(text).width;

  if (textWidth <= maxWidth || textWidth <= ellipsisWidth) {
    return text;
  } else {
    // Binary search for the longest string below max width
    let leftBound = 0;
    let rightBound = text.length;
    while (leftBound < rightBound) {
      const subLength = Math.floor((leftBound + rightBound) / 2);
      newText = text.substring(0, subLength);
      textWidth = ctx.measureText(newText).width;
      if (textWidth + ellipsisWidth < maxWidth) {
        leftBound = subLength + 1;
      } else {
        rightBound = subLength;
      }
    }
    return newText + suffix;
  }
}
export function drawTextWithEllipsis(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
): TextMetrics {
  const ellipsisText = truncate(ctx, text, x, maxWidth);
  ctx.fillText(ellipsisText, x, y);
  return ctx.measureText(ellipsisText);
}

export function drawTypeBadge(
  ctx: CanvasRenderingContext2D,
  theme: Theme,
  typeName: 'number' | 'text' | 'date' | 'array' | 'unspecified',
  x: number,
  y: number,
): void {
  const tagFont = `bold 10px ${theme.fontFamily}`;
  const bgColor = str2hsl(getComputedStyle(ctx.canvas).getPropertyValue('--theme-surface'));
  const backgroundColor = hsl2str({
    ...bgColor,
    s: bgColor.s > 0 ? 70 : 0,
  });
  const textColor = theme.textDark;
  ctx.beginPath();
  ctx.font = tagFont;
  ctx.fillStyle = backgroundColor;
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  roundedRect(ctx, x, y - 9, measureTextCached(typeName, ctx, tagFont).width + 16, 18, 4);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.fillText(typeName.toUpperCase(), x + 4, y - 9 + 18 / 2 + getMiddleCenterBias(ctx, tagFont));
  ctx.closePath();
}
