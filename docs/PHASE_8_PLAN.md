# Phase 8 plan — location, safety and emergency

Phase 8 adds a provider location-sharing abstraction for active assigned bookings, authorized customer/family location views, tracking start/stop, location retention boundaries, emergency contact capture and incident records. Location data is only accepted for assigned active bookings and is not exposed to unrelated customers or providers. The map provider is an adapter boundary; no live map integration or medical/ambulance claim is made.

Emergency handling records the active booking, latest authorized location, reporter, severity, operations-visible incident and resolution audit. Development notifications are used as hooks; external dispatch is out of scope. Tests cover location ownership, tracking lifecycle, incident authorization and privacy.
