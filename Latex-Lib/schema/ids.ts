/**
 * The library's ids (ARCHITECTURE.md section 1). Every id is a plain string
 * with a fixed shape, so a rule that names one can be checked to resolve.
 */

/** Any value that survives JSON: what a key holds, hashes and writes out. */
export type Json = null | boolean | number | string | readonly Json[] | { readonly [key: string]: Json | undefined };

/** `type/kind`, as Flouest's nesting list names it (`containerBlock/mathElement`, `table_cell`), or `doc` for document-level ways. */
export type NodeId = string;
/** `<component>.<way>`: one published package or command family (`thm.amsthm`). */
export type WayId = string;
/** `class.<name>` (`class.llncs`). */
export type ClassId = string;
/** A package as `\usepackage` names it (`tcolorbox`). */
export type PackageId = string;

export const WAY_ID = /^[a-z][a-z0-9]*\.[a-z0-9][a-z0-9-]*$/;
export const CLASS_ID = /^class\.[a-z0-9][a-z0-9-]*$/;
export const PACKAGE_ID = /^[A-Za-z0-9][A-Za-z0-9-]*$/;

/** The node holding document-level ways (page, fonts, headers), attached to no Flouest node. */
export const DOC_NODE = 'doc';

/** A node's folder under `nodes/`: its id with `/` as `.` (`containerBlock.mathElement`). */
export const nodeFolder = (node: NodeId): string => node.replace(/\//g, '.');
