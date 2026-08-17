#!/bin/bash
set -euo pipefail

APP_PATH="dist/mac-arm64/Reword.app"
ENTITLEMENTS="build/entitlements.mac.plist"

if [ ! -d "$APP_PATH" ]; then
  echo "App not found at $APP_PATH"
  exit 1
fi

echo "Re-signing all components in $APP_PATH..."

# Sign nested code first, without --deep, so every binary shares the same ad-hoc identity.
find "$APP_PATH/Contents/Frameworks" -name '*.dylib' -print0 | while IFS= read -r -d '' lib; do
  codesign --force --sign - "$lib"
done

for framework in "$APP_PATH/Contents/Frameworks/"*.framework; do
  [ -d "$framework" ] || continue
  codesign --force --sign - "$framework"
done

for helper in "$APP_PATH/Contents/Frameworks/"*.app; do
  [ -d "$helper" ] || continue
  codesign --force --sign - --entitlements "$ENTITLEMENTS" "$helper"
done

codesign --force --sign - --entitlements "$ENTITLEMENTS" "$APP_PATH"

echo "Re-signing complete. Verifying..."
codesign --verify --deep --strict "$APP_PATH"
echo "Verification passed."
