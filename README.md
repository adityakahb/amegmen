Keyboard accessibility needs some attention if AMegMen would follow [WAI-ARIA Authoring Practices](https://w3c.github.io/aria-practices/).

`Tab` is used to move between components, not _within_ components. The [ARIA Practices example](https://w3c.github.io/aria-practices/examples/menubar/menubar-navigation.html) uses arrow keys to navigate _within_ the component, and allows both `Enter` and `Space` to open a submenu or activate a menu item.

# Menubar

| Key          | Function                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Space, Enter | Opens submenu and moves focus to first item in the submenu.                                                                                                                          |
| Right Arrow  | Moves focus to the next item in the menubar. If focus is on the last item, moves focus to the first item.                                                                            |
| Left Arrow   | Moves focus to the previous item in the menubar. If focus is on the first item, moves focus to the last item.                                                                        |
| Down Arrow   | Opens submenu and moves focus to first item in the submenu.                                                                                                                          |
| Up Arrow     | Opens submenu and moves focus to last item in the submenu.                                                                                                                           |
| Home         | Moves focus to first item in the menubar.                                                                                                                                            |
| End          | Moves focus to last item in the menubar.                                                                                                                                             |
| Character    | Moves focus to next item in the menubar having a name that starts with the typed character. If none of the items have a name starting with the typed character, focus does not move. |

# Submenu

| Key          | Function                                                                                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Space, Enter | Activates menu item, causing the link to be activated.                                                                                                                                                                                                                                                 |
| Escape       | Closes submenu. Moves focus to parent menubar item.                                                                                                                                                                                                                                                    |
| Right Arrow  | If focus is on an item with a submenu, opens the submenu and places focus on the first item. If focus is on an item that does not have a submenu: closes submenu; moves focus to next item in the menubar; and opens submenu of newly focused menubar item, keeping focus on that parent menubar item. |
| Left Arrow   | Closes submenu and moves focus to parent menu item. If parent menu item is in the menubar, also: moves focus to previous item in the menubar; and opens submenu of newly focused menubar item, keeping focus on that parent menubar item.                                                              |
| Down Arrow   | Moves focus to the next item in the submenu. If focus is on the last item, moves focus to the first item.                                                                                                                                                                                              |
| Up Arrow     | Moves focus to previous item in the submenu. If focus is on the first item, moves focus to the last item.                                                                                                                                                                                              |
| Home         | Moves focus to the first item in the submenu.                                                                                                                                                                                                                                                          |
| End          | Moves focus to the last item in the submenu.                                                                                                                                                                                                                                                           |
| Character    | Moves focus to the next item having a name that starts with the typed character. If none of the items have a name starting with the typed character, focus does not move.                                                                                                                              |

---

Although, perhaps the [Disclosure Navigation](https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation.html) component is an easier example to copy keyboard accessibility from.
