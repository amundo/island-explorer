---
lang: en
title:  \<message-log\> docs
css: message-log.css
---

<main>

This component is a simple message log that can be used to display messages to
the user. It is a simple list of messages that can be added to the log. The
messages are displayed in the order they are added. The log can be cleared by
calling the `clear()` method.

## Example

```html
<message-log></message-log>
```

```{=html}
<message-log></message-log>
```

## Attributes

## Methods

## Data

## Events

## Layouts

## See also

</main>

<script type="module">
import {MessageLog} from './MessageLog.js'

window.messageLog = document.querySelector('message-log')
</script>
