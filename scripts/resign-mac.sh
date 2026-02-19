#!/bin/bash
set -e

APP_PATH="dist/mac-arm64/Reword.app"
ENTITLEMENTS="build/entitlements.mac.plist"

if [ ! -d "$APP_PATH" ]; then
  echo "App not found at $APP_PATH"
  exit 1
fi

echo "Re-signing all components in $APP_PATH..."

for framework in "$APP_PATH/Contents/Frameworks/"*.framework; do
  codesign --force --deep --sign - "$framework"
done

for helper in "$APP_PATH/Contents/Frameworks/"*.app; do
  codesign --force --deep --sign - "$helper"
done

codesign --force --sign - --entitlements "$ENTITLEMENTS" "$APP_PATH"

echo "Re-signing complete. Verifying..."
codesign --verify --deep --strict "$APP_PATH"
echo "Verification passed."
