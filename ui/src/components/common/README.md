# Common shared components used throughout the app

## Directory types

### Pure presentation components

These components don't encode any Jore specific business logic and get all of their
data trough props, but they can access translations.
These folders are, in order (files in directories lower in the list can import components
from directories higher in the list):

- `LayoutComponents`
- `Buttons`
- `Loaders`
- `Dropdowns`
- `Modals`
- `Pagination`
- `InfoContainer`
- `Search`
- `Toast`
- `Version`

The previous listing is not an absolute and rigid order. But cross imports between
these modules need to be avoided.

### Feature components

These components likely belong to yet to be spec'd "Router, Root Layout and Root level
provider components" top-level module. These are likely single use-site, complex,
components that only export a single component, but which are composed of smaller pieces.

This list includes:

- `AsyncTaskList`
- `NavBar`
- `ReportWriter`

### Miscellaneous and Complex Jore components

The `Jore` directory/module is reserved components that are shared between multiple
page-modules, and which don't neatly fit into the other boxes. Also, components that
contain more complex logic and depend on redux or other app state bits, and as such
are not pure-presentational components.
