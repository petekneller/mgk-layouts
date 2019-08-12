# Design decisions

Hopefully the code will relatively self-explanatory however there are likely to be decisions made and algorithms applied that are not immediately obvious without some documentation. This pages attempts to serve that goal.


## Obstacles and obstacle construction

The `obstacle` module and its exported constructor have to serve several aims:
1. construct an object based on a set of pre-defined/known obstacles (eg. left/right turns, rotations, gates)
2. construct a 'free form' obstacle (one that is not pre-defined/known) based on a minimum set of required properties (eg. location, turn direction). This form, while not used by the web application, was extremely useful for prototyping and is still used in tests to keep the tests focused.
3. 'canonicalise' obstacles (and obstacle properties) from 'simplified forms'. While deserialisation (ie. from JSON) is not a concern of 'construction' as such, the obstacle construction in this application do accept simplified forms of some obstacle properties in order to ease their deserialisation and use. An example is the obstacle origin property: while it is represented and consumed by the application as a vector it can be specified at construction time as a simple object `{ x: 1, y: 2}`. The constructor transforms the simplified form into the canonical form (in the example given that is a vector using the `Victor.js` library). As per use case (1) this is convenient for prototyping/testing.

In light of use case (2) above the act of creating a known obstacle can be viewed as applying a template, or default set of properties, for a known obstacle 'name'.

With the above use cases in mind the process of constructing an obstacle can be described. It consists of three phases:

### Canonicalisation

As per use case (3) above, some obstacle properties can be represented in a simplified form for ease of use/serialization. The first phase of construction is to convert these into their canonical/internal forms for use. Examples include:
* as described above the obstacle origin can be represented as an object (eg. `{ x: 1, y: 2}`) rather than the more complicated vector format
* the canonical form of obstacle orientation is a North-oriented bearing (in degrees) (eg. 090 is East, right, along the +'ve X axis) but can also be represented to the constructor as a short-hand cardinal point (ie. "N", "E", "S", "W")

### Creation of known obstacles

An obstacle has an optional property called `name`. If this is present and names a known/pre-defined obstacle then any properties that can be derived from that pre-defined obstacle are added. For example, specifying a 'left turn' or 'right rotation' implies certain values of the obstacle, such as: location and radius of the boundary circle, entry and exit direction. This phase attempts to allow callers to override defaults for known obstacles, eg. in the example of the 'left turn' if the obstacle options passed included a boundary circle radius then this phase would keep that radius and not reset it to the default for left turns.

### Addition of default properties

This last stage acts to ensure that the obstacle returned from the constructor is complete and ready for use. It adds default values for properties that have not been added either by the caller or as part of the evaluation of known obstacles.


## Path calculation algorithm
