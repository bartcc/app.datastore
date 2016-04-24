/*******************************************************************\
* This file is part of Wikiwyg,                                     *
* a client-side MediaWiki Presentation layer                        *
* Copyright (C) 2005  Jim Higson                                    *
*                                                                   *
* This program is free software; you can redistribute it and/or     *
* modify it under the terms of the GNU General Public License       *
* as published by the Free Software Foundation; either version 2    *
* of the License, or (at your option) any later version.            *
*                                                                   *
* This program is distributed in the hope that it will be useful,   *
* but WITHOUT ANY WARRANTY; without even the implied warranty of    *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the     *
* GNU General Public License for more details.                      *
*                                                                   *
* You should have received a copy of the GNU General Public License *
* along with this program; if not, write to the Free Software       *
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA     *
* 02110-1301, USA.                                                  *
\*******************************************************************/


/*	Makes a singleton prototype Class Use like:

var Elvis = Singleton.create( [superclass ,]
{
	sing:
		function(){ alert("Evlis is singing") }
,	swing:
		function(){ alert("Evlis is swinging")}
,	live:
		function(){ alert("Evlis lives!")}
));

Elvis is now a Singleton. This is a normal Prototype class but calls to new
Elvis() will throw an exception. The Class has a method get() which returns
the single instance

Having created Elvis, we can use him like:

Elvis.get().swing();

Singleton.create takes any parameters Class.create does.
*/
var Singleton =
		{
			create:
				function ()
				{	return this._create( arguments, true  );
				}

		,	_create:
				function singletonclass__create( class_args, make_getter, lazy )
				{
					var ProtoClass = Class.create.apply( Class, class_args )
				//	instance hidden inside our closure:
					,	instance;

				/*	extend the Class created above to make a new class that
					can only be instantiated once: */
					ProtoClass =
						Class.create( ProtoClass,
						{
							initialize:
								function( $super )
								{
									if( instance )
										throw( "cannot create another - this is a singleton" );

									$super();
								}
						});

					if( lazy )
					{
					/*	the get creates the instance and then replaces itself with a
						function that always returns that instance */
						ProtoClass.get = 	function ()
											{	instance = new ProtoClass();
												ProtoClass.get = function(){ return instance; };
												return instance;
											};
					}else
					{
						instance = new ProtoClass();

						if( make_getter )
						{
						//	Allow access to instance via a Class function:
							ProtoClass.get =	function ()
												{	return instance;
												};
						}
					}

					return ProtoClass;
			}
		};
var LazySingleton =
		{	create:
				function ()
				{	return Singleton._create( arguments, true, true );
				}
		};
var IsolatedSingleton =
		{
			create:
				function ()
				{	return Singleton._create( arguments, false, false );
				}
		};