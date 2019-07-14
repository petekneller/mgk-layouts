# Introductory glossary

* A `course layout` (or just `course`) is the series of `obstacle`s that must be ridden in sequence in order to be completed.
* An `obstacle` is composed of one or more traffic cones that must be ridden either _around_ or _between_.
* Each obstacle has an `orientation`. For some obstacles (eg. left/right turns and rotations) the orientation is unimportant. For those obstacles that must be ridden through in a particular direction (eg. start/finish box) the orientation dictates the direction the rider must negotiate the obstacle.
* A `course path` (or just `path`) is the smooth sequence of lines and curves that depict, in an overly simplistic fashion, the path which a rider will take around the course layout.
* A `course segment` (or just `segment`) is the section of the path that exists between any two obstacles. A course of `N` obstacles is made up of `N-1` segments.

# Description of the approach being taken and further nomenclature

*TODO:* add diagram supporting the following points; a pair of right turns should be sufficient

* Each obstacle is considered to have a `boundary circle` - an imaginary circle of such a radius and located within, or near to, the obstacle such that a rider could follow the circumference of the boundary circle around or through the obstacle.
* The path through a course segment is considered to begin on the boundary circle of the first obstacle in the segment, travel toward the second obstacle in the segment, and end on the boundary circle of the second obstacle. The path touches each boundary circle at a tangent.
* Therefore the path through the whole course can be considered to be a series of straight lines between the boundary circles of obstacles, touching at a tangent to each, and an arc on each obstacles boundary circle beginning where the straight line from the previous segment ended and where the straight line of the next segment begins. This arc depicts the turn the rider will make to negotiate the obstacle.
* Where an obstacle requires the rider to go _through_ an obstacle the boundary circle can be considered to be centred on the edge or outside the obstacle, such that following the circumference directs the path through the centre of the obstacle.

*TODO:* add a diagram of a gate to support the point directly above about paths that go through obstacles


*TODO:* add diagram and explanation of coordinate system
